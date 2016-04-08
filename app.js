/* jshint undef: true, unused: true */
/* globals Firebase, L, $, console */


var bofDataRef = new Firebase( 'https://kitb1w34vt8.firebaseio-demo.com/bofs' );
var map = L.map( 'mapid' );

L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'gsilver.pk8alhme',
  accessToken: 'pk.eyJ1IjoiZ3NpbHZlciIsImEiOiJjaW1xYmxianowMGZsdXJra2FjbXhpYjE4In0.LL9yfFdOwvatCyCbxBDW_A'
} ).addTo( map );

map.locate( {
  setView: true,
  maxZoom: 16
} );

function onLocationFound( e ) {
  var radius = e.accuracy / 2;
  L.marker( e.latlng, {
      draggable: true,
      title: 'You are here'
    } ).addTo( map )
    .bindPopup( "<p>You are within " + radius + " meters from this <strong>point</strong></p><p>and here is a new line</p>" )
    .openPopup();
  L.circle( e.latlng, radius ).addTo( map );
}

function onLocationError(  ) {
  //do something
}

map.on( 'locationerror', onLocationError );
map.on( 'locationfound', onLocationFound );
map.on( 'click', function ( e ) {
  $( '#bofModal' ).attr( 'data-coords', [ e.latlng.lat, e.latlng.lng ] );
  $( '#bofModal' ).modal();
} );

$( '#bofModal' ).on( 'show.bs.modal', function () {
  //anything we need to do when modal is shown
} );

$( '#postBof' ).on( 'click', function () {
  var what = $( '#messageText' ).val();
  var start = $( '#newStartTime' ).val();
  var end = $( '#newEndTime' ).val();
  var coords = $( '#bofModal' ).attr( 'data-coords' ).split( ',' );
  var marker = {
    user: 'user',
    what: what,
    start: start,
    end: end,
    lat: coords[ 0 ],
    long: coords[ 1 ]
  };
  bofDataRef.push( marker );
  displayNewMarker( marker );
  $( '#messageText, #newStartTime, #newEndTime' ).val( '' );
} );

bofDataRef.on( 'child_added', function ( snapshot ) {
  var marker = snapshot.val();
  displayNewMarker( marker);

} );

var displayNewMarker = function ( marker) {
  marker = new L.marker( [ marker.lat, marker.long ] )
    .bindPopup( '<div>' +  marker.what + '</div><br>' +
      '<div class="intention" style="white-space: nowrap">Going? <div class=" btn-group btn-group-xs"><button data-intention="maybe" class="btn btn-default">Maybe</button><button data-intention="sure" class="btn btn-default">Sure</button></div></div>',{minWidth:200})
    .addTo( map );
};

$( "body" ).on( "click", ".intention button", function () {
  var intention = $(this).attr('data-intention');
  console.log(intention);
  // store this someplace where it can be looked up....
  //update original item? probably bad idea
  //bofDataIntentionsRef.push( marker );
});
