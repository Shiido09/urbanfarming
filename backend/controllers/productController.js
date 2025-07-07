const Product = require('../models/ProductModel');
const cloudinary = require('../config/cloudinary');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('user', 'name email').sort({ createdAt: -1 });
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
        const product = await Product.findById(req.params.id).populate('user', 'name email');
        
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

module.exports = {
    getAllProducts,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
