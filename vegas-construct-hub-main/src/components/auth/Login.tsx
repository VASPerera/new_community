
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface LoginProps {
  onViewChange: (view: 'login' | 'signup' | 'forgot') => void;
}

const Login = ({ onViewChange }: LoginProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async() => {
    // Mock authentication - in real app this would be API call
   try {
     const response = await axios.post('http://localhost:4000/agent/login', credentials)

    // console.log(response.data.agentId)

    
    if (response.status == 200) {

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('agentId', response.data.agentId);

      toast({
        title: "Welcome back!",
        description: "Login successful. Redirecting to projects..."
      });
      navigate('/projects');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
    }
    
   } catch (error) {
    toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
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
          Vegas Construction
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to manage your construction projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@vegasconstruction.com"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="h-12"
          />
        </div>
        
        <Button 
          onClick={handleLogin}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
        >
          Sign In
        </Button>

        <div className="text-center space-y-2">
          <button
            onClick={() => onViewChange('forgot')}
            className="text-sm text-amber-600 hover:text-amber-700 underline"
          >
            Forgot your password?
          </button>
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => onViewChange('signup')}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
          <p className="text-xs text-blue-600 mt-1">Email: admin@vegasconstruction.com</p>
          <p className="text-xs text-blue-600">Password: password123</p>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default Login;
