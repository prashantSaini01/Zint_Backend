import Invite from '../models/Invite.js';
import Board from '../models/Board.js';
import User from '../models/User.js';
import { sendEmail } from './email.js';
import crypto from 'crypto';

// Helper function to generate invite token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Create invite handler
export const createInvite = async (event) => {
    try {
      const { boardId } = event.pathParameters;
      const { email } = JSON.parse(event.body);
      const userId = event.requestContext.authorizer.principalId;
  
      // Check if user has permission to invite
      const board = await Board.findById(boardId);
      if (!board) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Board not found' }),
        };
      }
  
      if (board.owner.toString() !== userId && !board.collaborators.includes(userId)) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Not authorized to invite collaborators' }),
        };
      }
  
      // Check if user is already a collaborator
      const user = await User.findOne({ email });
      if (user && board.collaborators.includes(user._id)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'User is already a collaborator' }),
        };
      }
  
      // Check for existing invite
      const existingInvite = await Invite.findOne({ boardId, email, status: 'pending' });
      if (existingInvite) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invitation already sent' }),
        };
      }
  
      // Create new invite
      const invite = await Invite.create({
        boardId,
        email,
        invitedBy: userId,
        token: generateToken(),
      });
  
      // Send invitation email
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
        body: JSON.stringify({ invite }),
      };
    } catch (error) {
      console.error('Create invite error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to create invitation' }),
      };
    }
  };
  
  export const acceptInvite = async (event) => {
    try {
      const { token } = event.pathParameters;
      const userId = event.requestContext.authorizer.principalId;
  
      // Find the invite
      const invite = await Invite.findOne({ token, status: 'pending' });
      if (!invite) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid or expired invitation' }),
        };
      }
  
      // Add user to board collaborators
      await Board.findByIdAndUpdate(invite.boardId, {
        $addToSet: { collaborators: userId },
      });
  
      // Update invite status
      invite.status = 'accepted';
      await invite.save();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Invitation accepted successfully' }),
      };
    } catch (error) {
      console.error('Accept invite error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to accept invitation' }),
      };
    }
  };

  export const deleteInvite = async (event) => {
    try {
      const { boardId, inviteId } = event.pathParameters;
      const userId = event.requestContext.authorizer.principalId;
  
      // Find the board and verify permissions
      const board = await Board.findById(boardId);
      if (!board) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Board not found' }),
        };
      }
  
      if (board.owner.toString() !== userId && !board.collaborators.includes(userId)) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Not authorized to delete invites' }),
        };
      }
  
      // Delete the pending invite
      const deletedInvite = await Invite.findOneAndDelete({
        _id: inviteId,
        boardId,
        status: 'pending',
      });
  
      if (!deletedInvite) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Invite not found or already processed' }),
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Invitation cancelled successfully' }),
      };
    } catch (error) {
      console.error('Delete invite error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to cancel invitation' }),
      };
    }
  };
  


  
export const getBoardInvites = async (event) => {
    try {
      const { boardId } = event.pathParameters;
      const userId = event.requestContext.authorizer.principalId;
  
      // Verify the board exists and the user is authorized
      const board = await Board.findById(boardId);
      if (!board) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Board not found' }),
        };
      }
  
      if (board.owner.toString() !== userId && !board.collaborators.includes(userId)) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Not authorized to view board invites' }),
        };
      }
  
      // Retrieve all invites associated with the board
      const invites = await Invite.find({ boardId }).select('-__v -updatedAt'); // Exclude unnecessary fields
  
      return {
        statusCode: 200,
        body: JSON.stringify(invites),
      };
    } catch (error) {
      console.error('Get board invites error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to retrieve board invites' }),
      };
    }
  };