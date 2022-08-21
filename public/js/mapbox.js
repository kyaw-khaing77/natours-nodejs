/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9lZ3lpNzciLCJhIjoiY2w2c3k0eWVsMG1hbDNmbzdjamo5eHgzbCJ9.arPfKgxztIQEmO1U_mQv7w';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/moegyi77/cl6szw28e000d14lf2gf6z95g', // style URL
    //   center: [95.9013753, 16.8396098],
    scrollZoom: false,
    zoom: 5
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};
