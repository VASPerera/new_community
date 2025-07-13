
import { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ForgotPassword from '../components/auth/ForgotPassword';

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {currentView === 'login' && <Login onViewChange={setCurrentView} />}
          {currentView === 'signup' && <Signup onViewChange={setCurrentView} />}
          {currentView === 'forgot' && <ForgotPassword onViewChange={setCurrentView} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
