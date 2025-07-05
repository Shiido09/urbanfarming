import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Clock, MapPin, Heart, Share2, User } from "lucide-react";
import { useState } from "react";

interface Review {
  id: number;
  user: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  farmer: string;
  badge?: string;
  description?: string;
  harvestDate?: string;
  expiryDate?: string;
  location?: string;
  quantity?: string;
  freshnessPeriod?: string;
}

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  if (!product) return null;

  const sampleReviews: Review[] = [
    {
      id: 1,
      user: "Maria Santos",
      rating: 5,
      date: "2 days ago", 
      comment: "Super fresh and tasty! The tomatoes were perfect for my salad. Will definitely order again!"
    },
    {
      id: 2,
      user: "John Cruz",
      rating: 4,
      date: "1 week ago",
      comment: "Good quality produce. Delivered on time and well packaged. Highly recommended!"
    },
    {
      id: 3,
      user: "Ana Reyes",
      rating: 5,
      date: "2 weeks ago", 
      comment: "Amazing! You can really taste the difference with organic vegetables. Thank you!"
    }
  ];

  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1546470427-e13b995d3aba?w=300&h=300&fit=crop&crop=center"
  ];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    onClose();
  };

  const submitReview = () => {
    if (newReview.trim()) {
      console.log("New review:", { rating: newRating, comment: newReview });
      setNewReview("");
      setNewRating(5);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge className={`absolute top-3 left-3 ${
                  product.badge === 'Sale' ? 'bg-farm-red-500' :
                  product.badge === 'New' ? 'bg-farm-red-600' :
                  product.badge === 'Limited' ? 'bg-orange-500' :
                  'bg-farm-red-600'
                } text-white`}>
                  {product.badge}
                </Badge>
              )}
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button variant="outline" size="sm" className="bg-white/80">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-farm-red-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-farm-red-600">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">From {product.farmer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Harvested: Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-farm-red-500" />
                <span className="text-sm text-farm-red-600">Best consumed within: 3-5 days</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm">
                Fresh organic {product.name.toLowerCase()} grown in our backyard garden using sustainable farming practices. 
                No pesticides or chemicals used. Hand-picked at peak ripeness for maximum flavor and nutrition.
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full bg-farm-red-600 hover:bg-farm-red-700 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Reviews ({sampleReviews.length})</h3>
          
          {/* Add Review */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-3">Write a Review</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`w-5 h-5 ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <Button 
                onClick={submitReview}
                className="bg-farm-red-600 hover:bg-farm-red-700 text-white"
                size="sm"
              >
                Submit Review
              </Button>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-4">
            {sampleReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{review.user}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
