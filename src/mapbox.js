  var branch = new L.LayerGroup();
  var branch_rich = new L.LayerGroup();
  var rich = new L.LayerGroup();
  var atm = new L.LayerGroup();
  var service = new L.LayerGroup();

      var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      mbUrl = 'https://api.mapbox.com/styles/v1/bigdata01/{id}/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmlnZGF0YTAxIiwiYSI6ImNpdDJnand6dzB0NmgyeWtoaXo3cnBtMHoifQ.da-eM-IDQOlkmfO4mN63zQ';

      var light   = L.tileLayer(mbUrl, {id: 'cit2j2opr00082xo5rj0k2o13', 
                        maxZoom: 18,
                        minZoom: 11,
                        attribution: mbAttr});


    var map = L.map('map', {
        center: [22.337533, 114.17475],
        zoom: 13,
        maxBounds: ([[22.176455, 113.817209],[22.560632, 114.451706]]),
        layers: [light, branch, branch_rich, rich, service, atm]
    });

    var baseMaps = {
      "light":light
    };

    var overlayMaps = {
        "一般分行": branch,
        "一般分行／服務特選客戶": branch_rich,
        "只服務特選客戶": rich,
        "服務中心": service,
        "自動櫃員機": atm
    };

    L.control.layers({}, overlayMaps, {
      collapsed: false,
      position: 'bottomright'
    }).addTo(map);

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>銀行服務</h4>' +  (props ?
            '<b>' + props.我們的分類 + '</b><br />' + props.銀行牌子 + '<br />' + props.地址
            : '請選擇');
    };

    info.addTo(map);

    function onEachFeature(feature, layer) {
          layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            })
        }


    function highlightFeature(e) {
        var layer = e.target;
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            // layer.bringToFront();
        }
    //     info.update(layer.feature.properties);
    }


    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function zoomToFeature(e) {
      var layer = e.target;
      var latLngs  = [e.target.getLatLng()];
      var markerBounds = L.latLngBounds(latLngs);
      map.fitBounds(markerBounds, {maxZoom: 18});
      info.update(layer.feature.properties);
    }


    var LeafIcon = L.Icon.extend({
        options: {
         // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        }
    });

    var branch_icon = new LeafIcon({iconUrl: 'icon/branch.png',iconSize:[30, 30]}),
        branch_rich_icon = new LeafIcon({iconUrl: 'icon/branch_rich.png',iconSize:[30, 30]}),
        rich_icon = new LeafIcon({iconUrl: 'icon/rich.png',iconSize:[30, 30]}),
        service_icon = new LeafIcon({iconUrl: 'icon/service.png',iconSize:[20, 20]}),
        atm_icon = new LeafIcon({iconUrl: 'icon/atm.png',iconSize:[20, 20]});


    geojson = L.geoJson(branch_list, {
      onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,  {icon: branch_icon});
        }
    }).addTo(branch);

    L.geoJson(branch_rich_list, {
      onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,  {icon: branch_rich_icon});
        }
    }).addTo(branch_rich);

    L.geoJson(rich_list, {
      onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,  {icon: rich_icon});
        }
    }).addTo(rich);

    L.geoJson(service_list, {
      onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,  {icon: service_icon});
        }
    }).addTo(service);


    L.geoJson(atm_list, {
      onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,  {icon: atm_icon});
        }
    }).addTo(atm);  
