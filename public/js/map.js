
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        // projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates, // center the map on this longitude and latitude
    });

    // map.addControl(new mapboxgl.NavigationControl());
    // map.scrollZoom.disable();

    // map.on('style.load', () => {
    //     map.setFog({}); // Set the default atmosphere style
    // });

    // console.log(coordinates);

    // const marker1 = new mapboxgl.Marker()
    //     .setLngLat(coordinates) // Listing.geometry.coordinates
    //     .addTo(map);

    const marker1 = new mapboxgl.Marker({ color: "red"})
    .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h5>${listing.title || "Location"}</h5><p>Exact Location will be provided after booking!</p>`))
    .addTo(map);

    // In this need to add another coordinates otherwise marker will add in previous one,
    // They will be stacked on top of each other
    // const marker2 = new mapboxgl.Marker({ color: "red"})
    // .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
    // .setPopup(new mapboxgl.Popup({ offset: 25 })
    // .setHTML(`<h5>${listing.title}</h5><p>Exact Location will be provided after booking!</p>`))
    // .addTo(map);