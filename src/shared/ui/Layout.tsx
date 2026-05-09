import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { AppDispatch, RootState } from '../../app/store';

export const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/forecast', label: 'Forecast', icon: '📅' },
    { path: '/alerts', label: 'Alerts', icon: '⚠️' },
    { path: '/analysis', label: 'Analysis', icon: '📊' },
    { path: '/compare', label: 'Compare', icon: '🔄' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-500">WeatherASM</h1>
          <p className="text-sm text-gray-500 mt-1">Weather Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t dark:border-gray-800">
          <div className="mb-3">
            <p className="text-sm font-medium">{user?.full_name || user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
