export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)} km/h`;
};

export const formatPrecipitation = (precip: number): string => {
  return `${precip.toFixed(1)} mm`;
};

export const getWeatherConditionClass = (code: number): string => {
  if (code === 0) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code <= 55) return 'rainy';
  if (code <= 75) return 'snowy';
  if (code === 95) return 'stormy';
  return 'default';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const groupBy = <T, K extends PropertyKey>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = key(item);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<K, T[]>);
};
