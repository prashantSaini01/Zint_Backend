import Invite from '../models/Invite.js';
import Board from '../models/Board.js';
import User from '../models/User.js';
import { sendEmail } from './email.js';
import crypto from 'crypto';

// Utility function for generating error responses
const createErrorResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

// Utility function to check user permissions
const checkPermissions = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { statusCode: 404, message: 'Board not found' };

  const isAuthorized = board.owner.toString() === userId || board.collaborators.includes(userId);
  if (!isAuthorized) return { statusCode: 403, message: 'Not authorized' };

  return { board };
};

// Helper function to generate invite token
const generateToken = () => crypto.randomBytes(32).toString('hex');

export const validateInvite = async (event) => {
  try {
    const { token } = event.pathParameters;

    const invite = await Invite.findOne({ token, status: 'pending' }).populate('boardId', 'title');
    if (!invite) return createErrorResponse(400, 'Invalid or expired invitation');

    return {
      statusCode: 200,
      body: JSON.stringify({
        invite,
        boardTitle: invite.boardId?.title,
        email: invite.email,
      }),
    };
  } catch (error) {
    console.error('Validate invite error:', error);
    return createErrorResponse(500, 'Failed to validate invitation');
  }
};

export const createInvite = async (event) => {
  try {
    const { boardId } = event.pathParameters;
    const { email } = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.principalId;

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return createErrorResponse(message.statusCode, message);

    const user = await User.findOne({ email });
    if (user && board.collaborators.includes(user._id)) {
      return createErrorResponse(400, 'User is already a collaborator');
    }

    const existingInvite = await Invite.findOne({ boardId, email, status: 'pending' });
    if (existingInvite) {
      return createErrorResponse(400, 'Invitation already sent');
    }

    const invite = await Invite.create({
      boardId,
      email,
      invitedBy: userId,
      token: generateToken(),
    });

    const inviteUrl = `http://localhost:3001/invite/${invite.token}`;
    await sendEmail({
      to: email,
      subject: `Invitation to collaborate on ${board.title}`,
      html: `
        <h1>Board Invitation</h1>
        <p>You've been invited to collaborate on the board "${board.title}"</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}">Accept Invitation</a>
      `,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        invite,
        message: "Your invitation will be sent shortly.",
      }),
    };
  } catch (error) {
    console.error('Create invite error:', error);
    return createErrorResponse(500, 'Failed to create invitation');
  }
};

export const acceptInvite = async (event) => {
  try {
    const { token } = event.pathParameters;
    const userId = event.requestContext.authorizer.principalId;

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return createErrorResponse(400, 'Invalid or expired invitation');

    const user = await User.findById(userId);
    if (user.email !== invite.email) {
      return createErrorResponse(403, 'Email mismatch. Please sign up with the email address the invitation was sent to.');
    }

    await Board.findByIdAndUpdate(invite.boardId, {
      $addToSet: { collaborators: userId },
    });

    invite.status = 'accepted';
    await invite.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Invitation accepted successfully', boardId: invite.boardId }),
    };
  } catch (error) {
    console.error('Accept invite error:', error);
    return createErrorResponse(500, 'Failed to accept invitation');
  }
};

export const deleteInvite = async (event) => {
  try {
    const { boardId, inviteId } = event.pathParameters;
    const userId = event.requestContext.authorizer.principalId;

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return createErrorResponse(message.statusCode, message);

    const deletedInvite = await Invite.findOneAndDelete({
      _id: inviteId,
      boardId,
      status: 'pending',
    });

    if (!deletedInvite) return createErrorResponse(404, 'Invite not found or already processed');

    return { statusCode: 200, body: JSON.stringify({ message: 'Invitation cancelled successfully' }) };
  } catch (error) {
    console.error('Delete invite error:', error);
    return createErrorResponse(500, 'Failed to cancel invitation');
  }
};

export const getBoardInvites = async (event) => {
  try {
    const { boardId } = event.pathParameters;
    const userId = event.requestContext.authorizer.principalId;

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return createErrorResponse(message.statusCode, message);

    const invites = await Invite.find({ boardId }).select('-__v -updatedAt');
    return { statusCode: 200, body: JSON.stringify(invites) };
  } catch (error) {
    console.error('Get board invites error:', error);
    return createErrorResponse(500, 'Failed to retrieve board invites');
  }
};
