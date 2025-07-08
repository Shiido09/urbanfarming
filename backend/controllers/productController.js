const Product = require('../models/ProductModel');
const cloudinary = require('../config/cloudinary');
const { softDeleteExpiredProducts } = require('../utils/productUtils');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Run soft delete check for expired products before fetching
        await softDeleteExpiredProducts();
        
        // Only fetch products that are not soft deleted (include products where isDeleted doesn't exist or is false)
        const products = await Product.find({ 
            $or: [
                { isDeleted: { $exists: false } },
                { isDeleted: false }
            ]
        }).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ 
            _id: req.params.id, 
            $or: [
                { isDeleted: { $exists: false } },
                { isDeleted: false }
            ]
        }).populate('user', 'name email');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product'
        });
    }
};

// Get current user's products
const getMyProducts = async (req, res) => {
    try {
        // Run soft delete check for expired products before fetching
        await softDeleteExpiredProducts();
        
        // Get all products (including soft deleted) for the user so they can see expired products
        const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your products'
        });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const {
            productName,
            productDescription,
            productPrice,
            productCategory,
            productStock,
            productExpiryDate
        } = req.body;

        // Validate required fields
        if (!productName || !productDescription || !productPrice || !productCategory || !productStock || !productExpiryDate) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Process uploaded images
        let productImages = [];
        if (req.files && req.files.length > 0) {
            productImages = req.files.map(file => ({
                public_id: file.filename,
                url: file.path
            }));
        }

        // Create product
        const product = new Product({
            productName,
            productDescription,
            productPrice: parseFloat(productPrice),
            productCategory: productCategory.toLowerCase(),
            productStock: parseInt(productStock),
            productExpiryDate: new Date(productExpiryDate),
            productimage: productImages,
            user: req.user._id
        });

        const savedProduct = await product.save();
        const populatedProduct = await Product.findById(savedProduct._id).populate('user', 'name email');

        res.status(201).json({
            success: true,
            data: populatedProduct,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating product'
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user owns the product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        const {
            productName,
            productDescription,
            productPrice,
            productCategory,
            productStock,
            productExpiryDate
        } = req.body;

        // Update fields
        if (productName) product.productName = productName;
        if (productDescription) product.productDescription = productDescription;
        if (productPrice) product.productPrice = parseFloat(productPrice);
        if (productCategory) product.productCategory = productCategory.toLowerCase();
        if (productStock) product.productStock = parseInt(productStock);
        if (productExpiryDate) product.productExpiryDate = new Date(productExpiryDate);

        // Process new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                public_id: file.filename,
                url: file.path
            }));
            product.productimage = [...product.productimage, ...newImages];
        }

        const updatedProduct = await product.save();
        const populatedProduct = await Product.findById(updatedProduct._id).populate('user', 'name email');

        res.status(200).json({
            success: true,
            data: populatedProduct,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating product'
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user owns the product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // Delete images from cloudinary
        if (product.productimage && product.productimage.length > 0) {
            for (const image of product.productimage) {
                try {
                    await cloudinary.uploader.destroy(image.public_id);
                } catch (cloudinaryError) {
                    console.warn('Warning: Could not delete image from cloudinary:', cloudinaryError);
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product'
        });
    }
};

// Add rating to product
const addRating = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already rated this product
        const existingRating = product.ratings.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.comment = comment || '';
            existingRating.createdAt = new Date();
        } else {
            // Add new rating
            product.ratings.push({
                user: req.user._id,
                rating,
                comment: comment || '',
                createdAt: new Date()
            });
        }

        // Calculate new average rating
        const totalRatings = product.ratings.length;
        const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
        
        product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        product.totalRatings = totalRatings;

        await product.save();
        
        const populatedProduct = await Product.findById(productId)
            .populate('user', 'name email')
            .populate('ratings.user', 'name');

        res.status(200).json({
            success: true,
            data: populatedProduct,
            message: existingRating ? 'Rating updated successfully' : 'Rating added successfully'
        });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding rating'
        });
    }
};

// Get seller statistics
const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        // Get all products by this seller
        const products = await Product.find({ user: sellerId });

        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalProducts: 0,
                    averageRating: 0,
                    totalRatings: 0,
                    totalSold: 0
                }
            });
        }

        // Calculate statistics
        const totalProducts = products.length;
        const totalSold = products.reduce((sum, product) => sum + (product.totalSold || 0), 0);
        
        // Calculate overall rating across all products
        let totalRatingSum = 0;
        let totalRatingCount = 0;
        
        products.forEach(product => {
            if (product.ratings && product.ratings.length > 0) {
                product.ratings.forEach(rating => {
                    totalRatingSum += rating.rating;
                    totalRatingCount++;
                });
            }
        });

        const averageRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
                totalRatings: totalRatingCount,
                totalSold
            }
        });
    } catch (error) {
        console.error('Error fetching seller stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching seller statistics'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addRating,
    getSellerStats
};
