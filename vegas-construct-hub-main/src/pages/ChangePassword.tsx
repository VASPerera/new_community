import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams(); // ✅ Moved outside function

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async () => {
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/agent/change-password/${id}/${token}`,
        { password: passwords.newPassword }
      );

      console.log("Response:", response.data);

      toast({
        title: "Success",
        description: "Password changed successfully!",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Change Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
