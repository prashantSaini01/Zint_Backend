import User from '../models/User.js';

// backend/controllers/userController.js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
});

export const getPresignedUrl = async (req, res) => {
  try {
    const fileType = req.query.fileType;
    
    // Validate file type
    if (!fileType.match(/^image\/(jpeg|png|gif)$/)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = fileType.split('/')[1];
    const key = `profile_pictures/${uniqueSuffix}.${extension}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3, putCommand, { expiresIn: 3600 });
    
    res.json({
      uploadUrl: presignedUrl,
      key: key,
      fileType: fileType
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ message: "Error generating upload URL" });
  }
};

export const updateUserProfilePic = async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: "No file key provided" });
    }

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
    
    await User.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });

    res.status(200).json({
      message: "Profile picture updated!",
      imageUrl
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user name
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a name'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if current password is correct
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save hook to hash the password

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};