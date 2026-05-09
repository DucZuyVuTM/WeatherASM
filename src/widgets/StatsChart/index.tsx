import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';
import { Card } from '../../shared/ui/Card';

interface StatsSummary {
  city_name: string;
  country_code: string | null;
  period_days: number;
  temp_avg: number | null;
  temp_max: number | null;
  temp_min: number | null;
  temp_std: number | null;
  humidity_avg: number | null;
  wind_speed_avg: number | null;
  wind_speed_max: number | null;
  precipitation_total: number | null;
  most_common_condition: string | null;
  records_count: number;
}

interface StatsChartProps {
  data: StatsSummary;
}

// Generate mock historical data for charts (in real app, this would come from API)
const generateMockData = (stats: StatsSummary) => {
  return Array.from({ length: stats.period_days }, (_, i) => ({
    day: i + 1,
    temperature: (stats.temp_avg || 20) + (Math.random() - 0.5) * 8,
    humidity: (stats.humidity_avg || 60) + (Math.random() - 0.5) * 20,
    windSpeed: (stats.wind_speed_avg || 10) + Math.random() * 10,
  }));
};

export const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const chartData = generateMockData(data);
  
  const pieData = [
    { name: 'Avg Temperature', value: data.temp_avg || 0 },
    { name: 'Avg Humidity', value: data.humidity_avg || 0 },
    { name: 'Avg Wind Speed', value: data.wind_speed_avg || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">🌡️</div>
            <div className="text-sm text-gray-500">Average Temperature</div>
            <div className="text-2xl font-bold">{data.temp_avg?.toFixed(1)}°C</div>
            <div className="text-xs text-gray-500">Std: ±{data.temp_std?.toFixed(1)}°C</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm text-gray-500">Temperature Range</div>
            <div className="text-2xl font-bold">
              {data.temp_min?.toFixed(1)}° - {data.temp_max?.toFixed(1)}°
            </div>
            <div className="text-xs text-gray-500">Min - Max</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">💧</div>
            <div className="text-sm text-gray-500">Average Humidity</div>
            <div className="text-2xl font-bold">{data.humidity_avg?.toFixed(0)}%</div>
            <div className="text-xs text-gray-500">Last {data.period_days} days</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">🌧️</div>
            <div className="text-sm text-gray-500">Total Precipitation</div>
            <div className="text-2xl font-bold">{data.precipitation_total?.toFixed(1)} mm</div>
            <div className="text-xs text-gray-500">Mostly {data.most_common_condition}</div>
          </div>
        </Card>
      </div>

      {/* Temperature Trend Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Temperature Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#FF6B6B" 
              strokeWidth={2}
              dot={{ fill: '#FF6B6B', strokeWidth: 2 }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Humidity & Wind Speed Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Humidity Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Wind Speed Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: 'Wind Speed (km/h)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="windSpeed" fill="#45B7D1" name="Wind Speed (km/h)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Pie Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Weather Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-col justify-center space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500">Analysis Period</div>
              <div className="font-semibold">{data.period_days} days</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500">Records Analyzed</div>
              <div className="font-semibold">{data.records_count} data points</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500">Most Common Condition</div>
              <div className="font-semibold">{data.most_common_condition || 'N/A'}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500">Max Wind Gust</div>
              <div className="font-semibold">{data.wind_speed_max?.toFixed(1)} km/h</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistical Info */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Statistical Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Temperature Variability</div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  style={{ width: `${Math.min(100, (data.temp_std || 0) * 10)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Standard Deviation: {data.temp_std?.toFixed(2)}°C
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Temperature Range</div>
            <div className="text-2xl font-semibold">
              {(data.temp_max || 0) - (data.temp_min || 0)}°C
            </div>
            <div className="text-xs text-gray-500">Max - Min difference</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Data Reliability</div>
            <div className="text-2xl font-semibold">
              {((data.records_count / (data.period_days * 24)) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Data completeness</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
