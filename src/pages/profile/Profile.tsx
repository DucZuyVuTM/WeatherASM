import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { userApi } from '../../shared/api/endpoints';
import { fetchLocations, addLocation, deleteLocation } from '../../features/locations/locationsSlice';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';

export const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { locations } = useSelector((state: RootState) => state.locations);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [newCity, setNewCity] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email,
      });
    }
    dispatch(fetchLocations());
  }, [dispatch, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.updateMe(profileData);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Update failed');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      await userApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setMessage('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Password change failed');
      }
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    
    try {
      await dispatch(addLocation(newCity)).unwrap();
      setNewCity('');
      setMessage('Location added successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add location');
      }
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      await dispatch(deleteLocation(id)).unwrap();
      setMessage('Location deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete location');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        My Profile
      </h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="weather-card">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="weather-card">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />
            <Button type="submit">Change Password</Button>
          </form>
        </div>

        {/* Saved Locations */}
        <div className="weather-card lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Saved Locations</h2>
          
          <form onSubmit={handleAddLocation} className="flex space-x-4 mb-6">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit">Add Location</Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {locations.map(loc => (
              <div key={loc.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{loc.city_name}</div>
                  <div className="text-sm text-gray-500">{loc.country_code}</div>
                </div>
                <button
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {locations.length === 0 && (
            <p className="text-gray-500 text-center py-4">No saved locations yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
