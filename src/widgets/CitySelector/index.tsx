import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../shared/ui/Card';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  savedLocations?: string[];
}

const POPULAR_CITIES = [
  'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'London', 'New York',
  'Tokyo', 'Paris', 'Sydney', 'Singapore', 'Bangkok'
];

export const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCity, 
  onCityChange, 
  savedLocations = [] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customCity, setCustomCity] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCities = [...new Set([...savedLocations, ...POPULAR_CITIES])];
  
  const filteredCities = allCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    onCityChange(city);
    setIsOpen(false);
    setSearchTerm('');
    setCustomCity('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      onCityChange(customCity.trim());
      setIsOpen(false);
      setSearchTerm('');
      setCustomCity('');
    }
  };

  return (
    <Card>
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select City
        </label>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 flex justify-between items-center"
            >
              <span className="text-gray-800 dark:text-white">{selectedCity}</span>
              <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </div>
            
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                
                {savedLocations.length > 0 && (
                  <div className="border-t dark:border-gray-700">
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase">Saved Locations</h4>
                    </div>
                    {savedLocations.map(city => (
                      <button
                        key={`saved-${city}`}
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <span>⭐</span>
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="border-t dark:border-gray-700">
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Popular Cities</h4>
                  </div>
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
                
                <div className="border-t dark:border-gray-700 p-3">
                  <form onSubmit={handleCustomSubmit} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter custom city..."
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              const randomCity = POPULAR_CITIES[Math.floor(Math.random() * POPULAR_CITIES.length)];
              onCityChange(randomCity);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Random City"
          >
            🎲
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {savedLocations.slice(0, 5).map(city => (
            <button
              key={`quick-${city}`}
              onClick={() => handleSelectCity(city)}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          💡 Tip: You can search any city worldwide!
        </div>
      </div>
    </Card>
  );
};
