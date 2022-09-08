import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const add3DBuildingsLayer = (map: mapboxgl.Map) => {
  // Insert the layer beneath any symbol layer.
  const layers = map.getStyle().layers;
  const labelLayer = layers.find(
    (layer) =>
      layer.type === 'symbol' && layer.layout && layer.layout['text-field'],
  );
  if (!labelLayer) return;
  const labelLayerId = labelLayer.id;

  // The 'building' layer in the Mapbox Streets
  // vector tileset contains building height data
  // from OpenStreetmap.
  map.addLayer(
    {
      id: 'add-3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
      },
    },
    labelLayerId,
  );
};

export default mapboxgl;
