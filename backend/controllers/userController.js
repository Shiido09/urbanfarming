const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const validator = require('validator');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
const registerUser = async (req, res) => {
    try {
        console.log('=== REGISTER USER REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Body keys:', Object.keys(req.body));
        console.log('Content-Type:', req.headers['content-type']);
        
        const { 
            name, 
            email, 
            address, 
            phone_number, 
            password, 
            gender,
            dateOfBirth,
            role = 'user' 
        } = req.body;

        console.log('Extracted fields:', {
            name,
            email,
            address,
            phone_number,
            password: password ? '[PROVIDED]' : '[MISSING]',
            gender,
            dateOfBirth,
            role
        });

        // Validation
        if (!name || !email || !address || !phone_number || !password || !gender || !dateOfBirth) {
            console.log('Validation failed - missing fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate and parse date of birth
        const birthDate = new Date(dateOfBirth);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid date of birth'
            });
        }

        // Check if date is not in the future
        const today = new Date();
        if (birthDate > today) {
            return res.status(400).json({
                success: false,
                message: 'Date of birth cannot be in the future'
            });
        }

        // Check if user is at least 13 years old
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        if (age < 13 || (age === 13 && monthDiff < 0) || (age === 13 && monthDiff === 0 && dayDiff < 0)) {
            return res.status(400).json({
                success: false,
                message: 'You must be at least 13 years old to register'
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Handle optional profile picture upload
        let profilePicture = {};
        if (req.file) {
            console.log('File uploaded:', req.file);
            profilePicture = {
                public_id: req.file.public_id || req.file.filename,
                url: req.file.secure_url || req.file.path
            };
            console.log('Profile picture object:', profilePicture);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Log user data before creation
        console.log('Creating user with data:', {
            name,
            email,
            address,
            phone_number,
            gender,
            dateOfBirth: birthDate,
            role,
            profilePicture,
            hasProfilePicture: !!req.file
        });

        // Create user
        const user = new User({
            name,
            email,
            address,
            phone_number,
            password: hashedPassword,
            gender,
            dateOfBirth: birthDate,
            role,
            profilePicture
        });

        console.log('User object before save:', user);
        await user.save();
        console.log('User saved successfully with ID:', user._id);

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        console.error('Request body:', req.body);
        console.error('Request file:', req.file);
        
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('ewallets');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user._id;
        const { 
            name, 
            address, 
            phone_number, 
            gender, 
            profilePicture,
            dateOfBirth
        } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (address) user.address = address;
        if (phone_number) user.phone_number = phone_number;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = profilePicture;
        
        // Update date of birth if provided
        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            if (isNaN(birthDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid date of birth'
                });
            }

            // Check if date is not in the future
            const today = new Date();
            if (birthDate > today) {
                return res.status(400).json({
                    success: false,
                    message: 'Date of birth cannot be in the future'
                });
            }

            user.dateOfBirth = birthDate;
        }

        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: userResponse }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Find user with password
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error changing password'
        });
    }
};

// Delete User (Admin or Self)
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user'
        });
    }
};

// Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers,
                    usersPerPage: limit
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
};

// Get Single User (Admin Only)
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
            .select('-password')
            .populate('ewallets');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteUser,
    getAllUsers,
    getUserById
};
