import React from 'react';
import { Card } from '../../shared/ui/Card';

interface WeatherAlert {
  level: string;
  type: string;
  message: string;
  value: number;
  threshold: number;
  unit: string;
}

interface AlertListProps {
  alerts: {
    city_name: string;
    country_code: string | null;
    alerts: WeatherAlert[];
    checked_at: string;
  };
}

const getAlertIcon = (type: string, level: string): string => {
  const icons: Record<string, string> = {
    'wind': '💨',
    'rain': '🌧️',
    'snow': '❄️',
    'heat': '🔥',
    'cold': '❄️',
    'thunderstorm': '⛈️',
  };
  
  const levelEmojis: Record<string, string> = {
    'warning': '⚠️',
    'watch': '👀',
    'advisory': 'ℹ️',
  };
  
  return levelEmojis[level] || icons[type] || '⚠️';
};

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'warning':
      return 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    case 'watch':
      return 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'advisory':
      return 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-700';
  }
};

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  const checkedTime = new Date(alerts.checked_at).toLocaleString();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Weather Alerts for {alerts.city_name}
          {alerts.country_code && <span className="text-gray-500 ml-2">({alerts.country_code})</span>}
        </h3>
        <span className="text-xs text-gray-500">Checked at {checkedTime}</span>
      </div>

      <div className="space-y-3">
        {alerts.alerts.map((alert, index) => {
          const icon = getAlertIcon(alert.type, alert.level);
          const levelColor = getLevelColor(alert.level);
          
          return (
            <Card key={index} className={`border-l-4 ${levelColor}`}>
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold uppercase">
                      {alert.level}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm capitalize">{alert.type}</span>
                  </div>
                  
                  <p className="text-sm mb-2">{alert.message}</p>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-600">
                      Current: {alert.value} {alert.unit}
                    </span>
                    <span className="text-gray-600">
                      Threshold: {alert.threshold} {alert.unit}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">⚠️ Alert Guidelines</h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• <strong>Warning:</strong> Severe weather is occurring or imminent - take immediate action</li>
          <li>• <strong>Watch:</strong> Conditions are favorable for severe weather - be prepared</li>
          <li>• <strong>Advisory:</strong> Less severe conditions that may cause significant inconvenience</li>
        </ul>
      </div>
    </div>
  );
};
