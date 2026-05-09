import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { AppDispatch, RootState } from '../../app/store';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Card } from '../../shared/ui/Card';

export const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setValidationError('');
    const registerData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      full_name: formData.full_name,
    };
    const result = await dispatch(register(registerData));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join WeatherASM today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <Input
            label="Full Name (Optional)"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          {(validationError || error) && (
            <div className="text-red-500 text-sm text-center">
              {validationError || error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Already have an account? Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};
