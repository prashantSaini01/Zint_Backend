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

export const validateInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({ token, status: 'pending' }).populate('boardId', 'title');
    if (!invite) return res.status(400).json({ message: 'Invalid or expired invitation' });

    return res.status(200).json({
      invite,
      boardTitle: invite.boardId?.title,
      email: invite.email,
    });
  } catch (error) {
    console.error('Validate invite error:', error);
    return res.status(500).json({ message: 'Failed to validate invitation' });
  }
};

export const createInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const boardId = id;
    const { email } = req.body;
    const userId = req.user.id; // assuming user ID is attached to the request context

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return res.status(message.statusCode).json({ message: message.message });

    const user = await User.findOne({ email });
    if (user && board.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    const existingInvite = await Invite.findOne({ boardId, email, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    const invite = await Invite.create({
      boardId,
      email,
      invitedBy: userId,
      token: generateToken(),
    });

    const inviteUrl = `https://sktj4oxskh.execute-api.ap-south-1.amazonaws.com/invite/${invite.token}`;
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

    return res.status(201).json({
      invite,
      message: "Your invitation will be sent shortly.",
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return res.status(500).json({ message: 'Failed to create invitation' });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id; // assuming user ID is attached to the request context

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return res.status(400).json({ message: 'Invalid or expired invitation' });

    const user = await User.findById(userId);
    if (user.email !== invite.email) {
      return res.status(403).json({ message: 'Email mismatch. Please sign up with the email address the invitation was sent to.' });
    }

    await Board.findByIdAndUpdate(invite.boardId, {
      $addToSet: { collaborators: userId },
    });

    invite.status = 'accepted';
    await invite.save();

    return res.status(200).json({ message: 'Invitation accepted successfully', boardId: invite.boardId });
  } catch (error) {
    console.error('Accept invite error:', error);
    return res.status(500).json({ message: 'Failed to accept invitation' });
  }
};

export const rejectInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id; // assuming user ID is attached to the request context

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return res.status(400).json({ message: 'Invalid or expired invitation' });

    const user = await User.findById(userId);
    if (user.email !== invite.email) {
      return res.status(403).json({ message: 'Email mismatch. Please sign up with the email address the invitation was sent to.' });
    }

    invite.status = 'rejected';
    await invite.save();

    return res.status(200).json({ message: 'Invitation rejected successfully' });
  } catch (error) {
    console.error('Reject invite error:', error);
    return res.status(500).json({ message: 'Failed to reject invitation' });
  }
};

export const deleteInvite = async (req, res) => {
  try {
    const { id, inviteId } = req.params;
    const boardId = id;
    const userId = req.user.id; // assuming user ID is attached to the request context

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return res.status(message.statusCode).json({ message: message.message });

    const deletedInvite = await Invite.findOneAndDelete({
      _id: inviteId,
      boardId,
      status: 'pending',
    });

    if (!deletedInvite) return res.status(404).json({ message: 'Invite not found or already processed' });

    return res.status(200).json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    console.error('Delete invite error:', error);
    return res.status(500).json({ message: 'Failed to cancel invitation' });
  }
};

export const getBoardInvites = async (req, res) => {
  try {
    const { id } = req.params;
    const boardId = id;
    const userId = req.user.id; // assuming user ID is attached to the request context

    const { board, message } = await checkPermissions(boardId, userId);
    if (!board) return res.status(message.statusCode).json({ message: message.message });

    const invites = await Invite.find({ boardId }).select('-__v -updatedAt');
    return res.status(200).json(invites);
  } catch (error) {
    console.error('Get board invites error:', error);
    return res.status(500).json({ message: 'Failed to retrieve board invites' });
  }
};
