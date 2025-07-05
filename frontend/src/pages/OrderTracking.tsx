
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Phone,
  MessageCircle,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  const orderStatus = {
    current: "out-for-delivery",
    steps: [
      { id: "confirmed", label: "Order Confirmed", completed: true, time: "10:30 AM" },
      { id: "packed", label: "Packed", completed: true, time: "11:45 AM" },
      { id: "shipped", label: "Shipped", completed: true, time: "2:15 PM" },
      { id: "out-for-delivery", label: "Out for Delivery", completed: true, time: "8:30 AM", active: true },
      { id: "delivered", label: "Delivered", completed: false, time: "" }
    ]
  };

  const courierInfo = {
    name: "SPX Express",
    phone: "+63 912 345 6789",
    rating: 4.8,
    vehicle: "Motorcycle",
    plateNumber: "ABC 1234"
  };

  const orderItems = [
    {
      id: 1,
      name: "Organic Tomatoes",
      quantity: 2,
      price: "₱8.99",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Fresh Herbs Bundle",
      quantity: 1,
      price: "₱15.99",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop&crop=center"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Order Tracking</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Map Section */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Truck className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Out for Delivery</p>
                  <p className="text-xs text-gray-500">Your order is on the way!</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm">
                <span className="text-sm font-medium">Order #HV12345</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-600">Estimated delivery date: Today</h3>
                <Badge className="bg-green-100 text-green-800">On Time</Badge>
              </div>
              <p className="text-sm text-gray-600">Expected delivery: 12:00 PM - 2:00 PM</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Progress */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Order Progress</h3>
            <div className="space-y-4">
              {orderStatus.steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? step.active 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? (
                      step.active ? <Truck className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${step.active ? 'text-red-600' : step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-sm text-gray-500">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courier Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Courier Information</h3>
              <Badge className="bg-blue-100 text-blue-800">{courierInfo.name}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SPX</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{courierInfo.name}</p>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{courierInfo.rating}</span>
                  <span className="text-sm text-gray-400">• {courierInfo.vehicle}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Vehicle Plate:</span>
                <span className="font-medium">{courierInfo.plateNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
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
                  <span className="font-medium text-red-600">{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Guarantee */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">Guaranteed On-Time Delivery</p>
                <p className="text-sm text-green-600">Get a ₱50 voucher if no delivery was attempted by 2:00 PM today.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default OrderTracking;
