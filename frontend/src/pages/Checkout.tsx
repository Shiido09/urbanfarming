
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Clock,
  Star,
  Shield 
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [selectedCourier, setSelectedCourier] = useState("spx");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const orderItems = [
    {
      id: 1,
      name: "Organic Tomatoes",
      quantity: 2,
      price: 8.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Fresh Herbs Bundle",
      quantity: 1,
      price: 15.99,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop&crop=center"
    }
  ];

  const couriers = [
    {
      id: "spx",
      name: "SPX Express",
      price: 5.00,
      time: "1-2 days",
      rating: 4.8,
      features: ["Real-time tracking", "Insurance coverage"]
    },
    {
      id: "jnt",
      name: "J&T Express",
      price: 4.50,
      time: "2-3 days",
      rating: 4.6,
      features: ["Affordable rates", "Wide coverage"]
    },
    {
      id: "lbc",
      name: "LBC Express",
      price: 6.00,
      time: "Same day",
      rating: 4.9,
      features: ["Same day delivery", "Premium service"]
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedCourierData = couriers.find(c => c.id === selectedCourier);
  const shipping = selectedCourierData?.price || 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Delivery Address
                  </h2>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">+63 912 345 6789</p>
                  <p className="text-sm text-gray-600">123 Sample Street, Barangay Sample, Manila City, Metro Manila, 1000</p>
                </div>
              </CardContent>
            </Card>

            {/* Courier Selection */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold flex items-center mb-4">
                  <Truck className="w-5 h-5 mr-2 text-red-600" />
                  Choose Courier
                </h2>
                <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
                  <div className="space-y-3">
                    {couriers.map((courier) => (
                      <div key={courier.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={courier.id} id={courier.id} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Label htmlFor={courier.id} className="font-medium cursor-pointer">
                              {courier.name}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">{courier.rating}</span>
                              </div>
                              <span className="font-bold text-red-600">₱{courier.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{courier.time}</span>
                            </div>
                            <div className="flex space-x-1">
                              {courier.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold flex items-center mb-4">
                  <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cash on Delivery</span>
                          <Badge className="bg-red-100 text-red-800">Recommended</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="gcash" id="gcash" />
                      <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                        <span className="font-medium">GCash</span>
                        <p className="text-sm text-gray-600">Pay securely with GCash</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping ({selectedCourierData?.name})</span>
                    <span>₱{shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-red-600">₱{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link to="/order-tracking">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 mb-4">
                    Place Order
                  </Button>
                </Link>
                
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
