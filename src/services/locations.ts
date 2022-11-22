import { Location } from '~/services/session';

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
export const getNearbyAddress = async (location?: Location) => {
  if (!location) return [];
  try {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coordinates[1]},${location.coordinates[0]}.json?access_token=${accessToken}`,
    );

    const payload = await response.json();
    const places = payload.features
      .filter(
        (feature: Feature) =>
          feature.id.includes('poi') || feature.id.includes('place'),
      )
      .map((feature: Feature, i: number) => ({
        id: i + 3,
        name: feature.place_name,
        emoji: getEmojiFromFeature(feature),
        type: 'address',
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

const getEmojiFromFeature = (feature: Feature) => {
  if (feature.place_type.includes('poi')) {
    if (feature.properties.category.includes('coffee')) {
      return '☕️';
    } else if (feature.properties.category.includes('beer')) {
      return '🍺';
    }
  }
  return '📍';
};

interface Feature {
  id: string;
  text: string;
  place_name: string;
  place_type: string[];
  properties: {
    category: string;
  };
}
