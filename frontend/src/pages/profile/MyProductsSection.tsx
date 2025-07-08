import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { productsAPI } from "@/services/api";
import { Plus, Edit, Trash2, Package, Calendar, DollarSign, Image, Upload, AlertTriangle } from "lucide-react";

const MyProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productCategory: "",
    productStock: "",
    productExpiryDate: "",
    productimage: []
  });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await productsAPI.getMyProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      productimage: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('productDescription', formData.productDescription);
      formDataToSend.append('productPrice', formData.productPrice);
      formDataToSend.append('productCategory', formData.productCategory);
      formDataToSend.append('productStock', formData.productStock);
      formDataToSend.append('productExpiryDate', formData.productExpiryDate);
      
      // Append images
      formData.productimage.forEach((file) => {
        formDataToSend.append('productimage', file);
      });

      let response;
      if (editingProduct) {
        response = await productsAPI.updateProduct(editingProduct._id, formDataToSend);
      } else {
        response = await productsAPI.createProduct(formDataToSend);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Product updated successfully" : "Product created successfully",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchMyProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice.toString(),
      productCategory: product.productCategory,
      productStock: product.productStock.toString(),
      productExpiryDate: product.productExpiryDate.split('T')[0],
      productimage: []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await productsAPI.deleteProduct(productId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchMyProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productDescription: "",
      productPrice: "",
      productCategory: "",
      productStock: "",
      productExpiryDate: "",
      productimage: []
    });
    setEditingProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isProductExpired = (product) => {
    return new Date(product.productExpiryDate) < new Date();
  };

  const getProductStatus = (product) => {
    if (product.isDeleted) {
      switch (product.deletionReason) {
        case 'expired':
          return { status: 'Expired', color: 'bg-red-100 text-red-800', reason: 'Product expired automatically' };
        case 'user_deleted':
          return { status: 'Deleted', color: 'bg-gray-100 text-gray-800', reason: 'Deleted by user' };
        case 'admin_deleted':
          return { status: 'Removed', color: 'bg-orange-100 text-orange-800', reason: 'Removed by administrator' };
        default:
          return { status: 'Deleted', color: 'bg-gray-100 text-gray-800', reason: 'Product deleted' };
      }
    }
    
    if (isProductExpired(product)) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800', reason: 'Product has expired' };
    }
    
    return { status: 'Active', color: 'bg-green-100 text-green-800', reason: null };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
          <p className="text-gray-600">Manage your vegetables and fruits</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="productCategory">Category</Label>
                  <Select value={formData.productCategory} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, productCategory: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productPrice">Price (₱)</Label>
                  <Input
                    id="productPrice"
                    name="productPrice"
                    type="number"
                    step="0.01"
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="productStock">Stock Quantity</Label>
                  <Input
                    id="productStock"
                    name="productStock"
                    type="number"
                    value={formData.productStock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="productExpiryDate">Expiry Date</Label>
                <Input
                  id="productExpiryDate"
                  name="productExpiryDate"
                  type="date"
                  value={formData.productExpiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="productimage">Product Images</Label>
                <Input
                  id="productimage"
                  name="productimage"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload multiple images (JPEG, PNG, WebP)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first product.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => {
            const productStatus = getProductStatus(product);
            const isInactive = product.isDeleted || isProductExpired(product);
            
            return (
              <Card 
                key={product._id} 
                className={`overflow-hidden transition-all ${
                  isInactive 
                    ? 'border-red-200 bg-red-50/30' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                  {/* Product Images */}
                  <div className="flex-shrink-0 relative">
                    {product.productimage && product.productimage.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 w-40">
                        {product.productimage.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.url}
                              alt={`${product.productName} ${index + 1}`}
                              className={`w-full h-16 object-cover rounded-lg ${
                                isInactive ? 'grayscale opacity-60' : ''
                              }`}
                            />
                          </div>
                        ))}
                        {product.productimage.length > 4 && (
                          <div className={`w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 ${
                            isInactive ? 'grayscale opacity-60' : ''
                          }`}>
                            +{product.productimage.length - 4} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`w-40 h-32 bg-gray-100 rounded-lg flex items-center justify-center ${
                        isInactive ? 'grayscale opacity-60' : ''
                      }`}>
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {product.productName}
                          </h3>
                          <Badge 
                            className={`${getProductStatus(product).color} text-xs font-medium`}
                          >
                            {getProductStatus(product).status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {product.productCategory}
                          </Badge>
                          {getProductStatus(product).reason && (
                            <span className="text-xs text-red-600 italic">
                              {getProductStatus(product).reason}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          disabled={product.isDeleted || isProductExpired(product)}
                          className={product.isDeleted || isProductExpired(product) ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                          disabled={product.isDeleted}
                          className={`text-red-600 hover:text-red-700 ${product.isDeleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {product.productDescription}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-semibold text-green-600">
                            {formatPrice(product.productPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Stock</p>
                          <p className="font-semibold">{product.productStock}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${
                          isProductExpired(product) ? 'text-red-600' : 'text-orange-600'
                        }`} />
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-500">Expires</p>
                            {isProductExpired(product) && (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <p className={`font-semibold ${
                            isProductExpired(product) ? 'text-red-600' : ''
                          }`}>
                            {formatDate(product.productExpiryDate)}
                            {isProductExpired(product) && (
                              <span className="text-xs ml-1">(Expired)</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-semibold">
                          {formatDate(product.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProductsSection;
