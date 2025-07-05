import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { useState } from "react";

const PurchaseSection = () => {
  const [activePurchaseStatus, setActivePurchaseStatus] = useState('all');
  
  const purchaseStatuses = [
    { id: 'all', name: 'All', count: 5 },
    { id: 'to-pay', name: 'To Pay', count: 2 },
    { id: 'to-ship', name: 'To Ship', count: 1 },
    { id: 'completed', name: 'Completed', count: 2 },
  ];

  const sampleOrders = [
    {
      id: 1,
      date: '2024-04-28',
      product: 'Organic Tomatoes',
      seller: 'Sarah\'s Garden',
      quantity: 2,
      total: '₱17.98',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      date: '2024-04-27',
      product: 'Fresh Herbs Bundle',
      seller: 'Green Thumb Co.',
      quantity: 1,
      total: '₱15.99',
      status: 'To Ship',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      date: '2024-04-26',
      product: 'Mixed Vegetables',
      seller: 'Urban Harvest',
      quantity: 1,
      total: '₱22.50',
      status: 'To Pay',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      date: '2024-04-25',
      product: 'Leafy Greens Pack',
      seller: 'Backyard Bounty',
      quantity: 1,
      total: '₱12.99',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      date: '2024-04-24',
      product: 'Seasonal Fruit Box',
      seller: 'Orchard Dreams',
      quantity: 1,
      total: '₱34.99',
      status: 'To Pay',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop&crop=center'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Purchase</h2>
        <div className="relative">
          <Input
            placeholder="Search orders..."
            className="w-64 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Purchase Status Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8 overflow-x-auto">
          {purchaseStatuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setActivePurchaseStatus(status.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activePurchaseStatus === status.id
                  ? 'border-farm-red-600 text-farm-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {status.name}
              {status.count > 0 && (
                <Badge className="ml-2 bg-farm-red-100 text-farm-red-800 text-xs">
                  {status.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders */}
      <div className="space-y-4">
        {sampleOrders
          .filter(order => 
            activePurchaseStatus === 'all' || 
            order.status.toLowerCase().replace(' ', '-') === activePurchaseStatus
          )
          .map((order) => (
            <Card key={order.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Order #{order.id}</span>
                    <Badge className={`${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'To Ship' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'To Pay' ? 'bg-farm-red-100 text-farm-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">{order.date}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={order.image} 
                    alt={order.product}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{order.product}</h4>
                    <p className="text-sm text-gray-600">from {order.seller}</p>
                    <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.total}</p>
                    <div className="flex space-x-2 mt-2">
                      {order.status === 'Completed' && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Rate & Review
                        </Button>
                      )}
                      {order.status === 'To Pay' && (
                        <Button size="sm" className="bg-farm-red-600 hover:bg-farm-red-700 text-white text-xs">
                          Pay Now
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      
      {sampleOrders.filter(order => 
        activePurchaseStatus === 'all' || 
        order.status.toLowerCase().replace(' ', '-') === activePurchaseStatus
      ).length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No orders found</h3>
          <p className="text-gray-400">You haven't made any orders in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseSection;
