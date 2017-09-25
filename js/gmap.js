var map;
var mapDiv;
var marker;

function init() {
    mapDiv = document.getElementById('map-canvas');
    map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(29.98236396713543, -95.662380877604),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    changeMarkers();
    var distanceWidget = new DistanceWidget(map);
    google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
        displayInfo(distanceWidget);
    });

    google.maps.event.addListener(distanceWidget, 'position_changed', function() {
        displayInfo(distanceWidget);
    });


}

google.maps.event.addDomListener(window, 'load', init);

/**
 * A distance widget that will display a circle that can be resized and will
 * provide the radius in km.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function DistanceWidget(map) {

    this.set('map', map);
    this.set('position', map.getCenter());

    marker = new google.maps.Marker({
        draggable: false,
        icon: {
            url: "http://labs.google.com/ridefinder/images/mm_20_green.png",
            size: new google.maps.Size(500, 500),
            anchor: new google.maps.Point(0,0)
        },
        title: 'Move me!'
    });

    // Bind the marker map property to the DistanceWidget map property
    marker.bindTo('map', this);

    // Bind the marker position property to the DistanceWidget position
    // property
    marker.bindTo('position', this);

    // Create a new radius widget
    var radiusWidget = new RadiusWidget();

    // Bind the radiusWidget map to the DistanceWidget map
    radiusWidget.bindTo('map', this);

    // Bind the radiusWidget center to the DistanceWidget position
    radiusWidget.bindTo('center', this, 'position');

    // Bind to the radiusWidgets' distance property
    this.bindTo('distance', radiusWidget);

    // Bind to the radiusWidgets' bounds property
    this.bindTo('bounds', radiusWidget);
}
DistanceWidget.prototype = new google.maps.MVCObject();

/**
 * A radius widget that add a circle to a map and centers on a marker.
 *
 * @constructor
 */
function RadiusWidget() {
    var circle = new google.maps.Circle({
        strokeWeight: 2
    });

    // Set the distance property value, default to 50km.
    this.set('distance', 0.5);

    // Bind the RadiusWidget bounds property to the circle bounds property.
    this.bindTo('bounds', circle);

    // Bind the circle center to the RadiusWidget center property
    circle.bindTo('center', this);

    // Bind the circle map to the RadiusWidget map
    circle.bindTo('map', this);

    // Bind the circle radius property to the RadiusWidget radius property
    circle.bindTo('radius', this);

    this.addSizer_();
}
RadiusWidget.prototype = new google.maps.MVCObject();


/**
 * Update the radius when the distance has changed.
 */
RadiusWidget.prototype.distance_changed = function() {
    this.set('radius', this.get('distance') * 1000);
};
/**
 * Add the sizer marker to the map.
 *
 * @private
 */
RadiusWidget.prototype.addSizer_ = function() {
    var sizer = new google.maps.Marker({
        draggable: true,
        icon: {
            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
            size: new google.maps.Size(7, 7),
            anchor: new google.maps.Point(4, 4)
        },
        title: 'Drag me!'
    });

    sizer.bindTo('map', this);
    sizer.bindTo('position', this, 'sizer_position');

    var me = this;
    google.maps.event.addListener(sizer, 'drag', function() {
        // Set the circle distance (radius)
        me.setDistance();
    });
};

/**
 * Update the center of the circle and position the sizer back on the line.
 *
 * Position is bound to the DistanceWidget so this is expected to change when
 * the position of the distance widget is changed.
 */
RadiusWidget.prototype.center_changed = function() {
    var bounds = this.get('bounds');

    // Bounds might not always be set so check that it exists first.
    if (bounds) {
        var lng = bounds.getNorthEast().lng();

        // Put the sizer at center, right on the circle.
        var position = new google.maps.LatLng(this.get('center').lat(), lng);
        this.set('sizer_position', position);
    }
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};


/**
 * Set the distance of the circle based on the position of the sizer.
 */
RadiusWidget.prototype.setDistance = function() {
    // As the sizer is being dragged, its position changes.  Because the
    // RadiusWidget's sizer_position is bound to the sizer's position, it will
    // change as well.
    var pos = this.get('sizer_position');
    var center = this.get('center');
    var distance = this.distanceBetweenPoints_(center, pos);

    // Set the distance property for any objects that are bound to it
    this.set('distance', distance);
};

function displayInfo(widget) {
    var info = document.getElementById('info');
    info.innerHTML = 'Position: ' + widget.get('position').toUrlValue(3) + ', distance: ' + widget.get('distance').toFixed(3);
}


function changeMarkers() {

    var features = [
        { position: new google.maps.LatLng(29.979007, -95.664598), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.980893, -95.658188), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png' },
        { position: new google.maps.LatLng(29.985880, -95.660323), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.980180, -95.658469), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png' },
        { position: new google.maps.LatLng(29.978463, -95.661145), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.980758, -95.658031), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.978660, -95.660236), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png' },
        { position: new google.maps.LatLng(29.981699, -95.667157), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.982101, -95.667218), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.978271, -95.661143), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.979867, -95.666367), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.978686, -95.665016), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png' },
        { position: new google.maps.LatLng(29.987858, -95.663951), url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png' }

    ];
    features.forEach(function(feature) {

        marker = new google.maps.Marker({
            position: feature.position,
            icon: feature.url,
            map: map
        });
    });


}