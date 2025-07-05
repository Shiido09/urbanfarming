const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteUser,
    getAllUsers,
    getUserById
} = require('../controllers/userController');
const {
    authenticateUser,
    authorizeAdmin,
    authorizeOwnerOrAdmin
} = require('../middleware/auth');

// Public routes
router.post('/register', (req, res, next) => {
    console.log('Register route hit');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Check if it's multipart/form-data (file upload)
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        console.log('Processing as multipart/form-data');
        upload.single('profilePicture')(req, res, (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message || 'File upload error'
                });
            }
            console.log('Multer processed successfully');
            console.log('Body after multer:', req.body);
            console.log('File after multer:', req.file);
            registerUser(req, res);
        });
    } else {
        console.log('Processing as regular JSON');
        // No file upload, proceed directly
        registerUser(req, res);
    }
});
router.post('/login', loginUser);

// Protected routes - User authentication required
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.put('/change-password', authenticateUser, changePassword);

// Protected routes - Owner or Admin can access
router.put('/:id', authenticateUser, authorizeOwnerOrAdmin, updateUserProfile);
router.delete('/:id', authenticateUser, authorizeOwnerOrAdmin, deleteUser);

// Admin only routes
router.get('/', authenticateUser, authorizeAdmin, getAllUsers);
router.get('/:id', authenticateUser, authorizeAdmin, getUserById);

module.exports = router;
