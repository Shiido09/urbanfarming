import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // Initialize form data with user data if available
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone_number: user?.phone_number || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(!user); // Only show loading if no user data

  // Pre-populate form with user data from auth context and fetch latest data
  useEffect(() => {
    // First, pre-populate with existing user data from context
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone_number: user.phone_number || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
      });
      setFetchingProfile(false); // If we have user data, we can show the form immediately
    }

    // Then fetch the latest profile data from server in background
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            address: userData.address || '',
            phone_number: userData.phone_number || '',
            gender: userData.gender || '',
            dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
          });
          // Update auth context with latest data
          updateUser(userData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (!user) { // Only show error if we don't have any user data
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, updateUser, toast]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        updateUser(response.data.user);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading latest profile data...</div>
      </div>
    );
  }

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Profile Information</CardTitle>
      </CardHeader>
      
      {/* Profile Picture Section */}
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-20 h-20">
          <AvatarImage 
            src={user?.profilePicture?.url || "/placeholder.svg"} 
            alt={user?.name || "Profile"} 
          />
          <AvatarFallback className="bg-farm-red-600 text-white text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user?.name}</h3>
          <p className="text-sm text-gray-600">Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</p>
          <p className="text-sm text-gray-600">Wallet Balance: ${user?.defaultWallet || 0}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input 
              type="tel" 
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="Enter your phone number" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <Input 
              type="date" 
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <Input 
              type="text" 
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your address" 
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <Button 
            type="submit"
            disabled={loading}
            className="bg-farm-red-600 hover:bg-farm-red-700 text-white"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
