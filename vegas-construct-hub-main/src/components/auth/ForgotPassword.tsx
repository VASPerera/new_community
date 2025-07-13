
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface ForgotPasswordProps {
  onViewChange: (view: 'login' | 'signup' | 'forgot') => void;
}

const ForgotPassword = ({ onViewChange }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');

 const handleResetPassword = async () => {
  if (!email) {
    toast({
      title: "Error",
      description: "Please enter your email address.",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:4000/agent/forgotpassword', { email });

    console.log(response);

    toast({
      title: "Reset Link Sent!",
      description: "If an account with this email exists, you will receive a password reset link.",
    });

    setTimeout(() => {
      onViewChange('login');
    }, 2000); // 2 seconds
    
  } catch (error: any) {
    console.error('Network Error:', error.message);
    console.error('Full error:', error);
    toast({
      title: "Error",
      description: error.response?.data?.error || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};


  return (
    <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Reset Password
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
        </div>
        
        <Button 
          onClick={handleResetPassword}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
        >
          Send Reset Link
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => onViewChange('login')}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
