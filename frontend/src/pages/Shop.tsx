
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShoppingCart, Star, Filter, Search, Heart, ChevronDown } from "lucide-react";
import { useState } from "react";
import ProductDetailDialog from "@/components/ProductDetailDialog";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState(new Set(["Plants"]));

  const allProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: "₱8.99",
      originalPrice: "₱12.99",
      rating: 4.9,
      reviews: 124,
      sold: 1200,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop&crop=center",
      category: "Vegetables",
      farmer: "Sarah's Garden"
    },
    {
      id: 2,
      name: "Fresh Herbs Bundle",
      price: "₱15.99",
      rating: 4.8,
      reviews: 89,
      sold: 890,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop&crop=center",
      category: "Herbs",
      farmer: "Green Thumb Co."
    },
    {
      id: 3,
      name: "Mixed Vegetables",
      price: "₱22.50",
      originalPrice: "₱28.00",
      rating: 4.7,
      reviews: 156,
      sold: 650,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop&crop=center",
      category: "Vegetables",
      farmer: "Urban Harvest"
    },
    {
      id: 4,
      name: "Leafy Greens Pack",
      price: "₱12.99",
      rating: 4.9,
      reviews: 203,
      sold: 450,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop&crop=center",
      category: "Vegetables",
      farmer: "Backyard Bounty"
    },
    {
      id: 5,
      name: "Seasonal Fruit Box",
      price: "₱34.99",
      originalPrice: "₱42.99",
      rating: 4.8,
      reviews: 98,
      sold: 320,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop&crop=center",
      category: "Fruits",
      farmer: "Orchard Dreams"
    },
    {
      id: 6,
      name: "Root Vegetables",
      price: "₱18.75",
      rating: 4.6,
      reviews: 67,
      sold: 280,
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=300&h=300&fit=crop&crop=center",
      category: "Vegetables",
      farmer: "Earth & Soil"
    }
  ];

  const topSellingProducts = [
    {
      id: 101,
      name: "Cactus",
      category: "450 Plants",
      price: "₱248",
      image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 102,
      name: "Kalanchoe",
      category: "350 Plants",
      price: "₱648",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 103,
      name: "Succulent",
      category: "320 Plants",
      price: "₱190",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 104,
      name: "Cactus Mini",
      category: "450 Plants",
      price: "₱276",
      image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 105,
      name: "Ephorbia",
      category: "450 Plants",
      price: "₱528",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=100&fit=crop&crop=center"
    }
  ];

  const categories = ["Gardening", "Plants", "Seeds", "Bulbs", "Planters", "Vegetables", "Fruits", "Herbs"];

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    setAddingToCart(productId);
    
    setTimeout(() => {
      setAddingToCart(null);
      console.log(`Added product ${productId} to cart`);
    }, 1000);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const toggleCategory = (category) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="border-gray-300 lg:hidden">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {searchQuery && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Search result for "{searchQuery}" ({filteredProducts.length} items)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              
              {/* Categories */}
              <Card className="p-4">
                <h3 className="font-medium text-gray-800 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.has(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                  <Button variant="ghost" className="text-sm text-gray-500 p-0 h-auto flex items-center">
                    Other Categories <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>

              {/* Price Range */}
              <Card className="p-4">
                <h3 className="font-medium text-gray-800 mb-4">Price range</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Min</span>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="flex-1 text-sm"
                      placeholder="₱ 0"
                    />
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm">
                    Set price
                  </Button>
                </div>
              </Card>

              {/* Rating */}
              <Card className="p-4">
                <h3 className="font-medium text-gray-800 mb-4">Rating</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="above-rating"
                      defaultChecked
                      className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-1">above</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Promo Banner */}
              <Card className="p-4 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <h3 className="font-bold text-lg mb-2">Get Flat 20% OFF</h3>
                <p className="text-sm mb-3 opacity-90">Share your referral code and get the discount!</p>
                <Button className="w-full bg-white text-red-600 hover:bg-gray-100 text-sm">
                  Set price
                </Button>
              </Card>
              
            </div>
          </div>

          {/* Middle - Products */}
          <div className="lg:col-span-2">
            {/* Sort Options */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600 py-2">Sort</span>
              <Button size="sm" className="bg-red-600 text-white">Indoor Plants</Button>
              <Button variant="outline" size="sm">Popular</Button>
              <Button variant="outline" size="sm">Most New</Button>
              <Button variant="outline" size="sm" className="flex items-center">
                Price <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Products Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute top-2 right-2 p-1 h-7 w-7 rounded-full ${
                        favorites.has(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
                      }`}
                      onClick={(e) => toggleFavorite(e, product.id)}
                    >
                      <Heart className={`w-3 h-3 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    {/* Rating badge */}
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                    </div>

                    {/* Sold count */}
                    {product.sold && (
                      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full">
                        <span className="text-xs text-gray-600">{product.sold} sold</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-base font-bold text-red-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">{product.farmer}</p>
                    
                    <Button 
                      className={`w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 transition-all duration-300 transform ${
                        addingToCart === product.id ? 'scale-95 bg-green-600 animate-pulse' : 'hover:scale-105'
                      }`}
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={addingToCart === product.id}
                    >
                      <ShoppingCart className={`w-3 h-3 mr-1 ${addingToCart === product.id ? 'animate-bounce' : ''}`} />
                      {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty state when no search results */}
            {searchQuery && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found for "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="border-gray-300 text-gray-600"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Top Selling */}
          <div className="hidden lg:block">
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-4">Top Selling</h3>
              <div className="space-y-4">
                {topSellingProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <p className="text-sm font-bold text-gray-800">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>

      <ProductDetailDialog 
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Shop;
