
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios'

interface SignupProps {
  onViewChange: (view: 'login' | 'signup' | 'forgot') => void;
}

const Signup = ({ onViewChange }: SignupProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });

  const handleSignup = async() => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    const response = await axios.post('http://localhost:4000/agent/register',formData)

    // console.log(response);

    toast({
      title: "Account Created!",
      description: "Your account has been created successfully. Please sign in."
    });
    onViewChange('login');
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
          Join Vegas Construction
        </CardTitle>
        <CardDescription className="text-gray-600">
          Create your account to start managing projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@company.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Your Company Name"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        
        <Button 
          onClick={handleSignup}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
        >
          Create Account
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onViewChange('login')}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signup;
