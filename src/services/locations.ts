import { Location } from './session';

export const getNearbyPlaces = async (type?: string, location?: Location) => {
  if (!location || !type) return [];
  try {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?type=poi&limit=3&proximity=${location.coordinates[1]},${location.coordinates[0]}.json&access_token=${accessToken}`,
    );

    const payload = await response.json();
    const places = payload.features.map((feature: Feature, i: number) => ({
      id: i,
      name: feature.place_name,
      emoji: getEmojiFromType(type),
      type: type,
    }));
    return places;
  } catch (error) {
    console.error(error);
  }
};

const getEmojiFromType = (type: string) => {
  switch (type) {
    case 'cafe':
      return '☕️';
    case 'pub':
      return '🍺';
    case 'bar':
      return '🍺';
    default:
      return '📍';
  }
};

interface Feature {
  text: string;
  place_name: string;
}
