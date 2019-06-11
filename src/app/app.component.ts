import { Component, OnInit } from '@angular/core';

declare let L;
declare let tomtom: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    const map = createMap();
    // Search input field
    this.addSearchBox(map);
  }

  private addSearchBox(map: any) {
    const searchBoxInstance =  tomtom.searchBox({
      position: 'topright',
      language: 'en-GB',
      serviceOptions: { unwrapBbox: true },
      collapsed: true,
      view: 'IN'
    }).addTo(map);

    // Marker layer to display the results over the map
    var markersLayer = L.tomTomMarkersLayer().addTo(map);

    // Draw markers for all the results found by the searchBox control (before user selects one)
    searchBoxInstance.on(searchBoxInstance.Events.ResultsFound, function(results) {
        markersLayer.setMarkersData(results.data)
            .addMarkers();
    });

    // Draw markers for all the results found by the searchBox control (before user selects one)
    searchBoxInstance.on(searchBoxInstance.Events.ResultsCleared, function() {
      markersLayer.clearLayers();
    });

    // Add a marker to indicate the position of the result selected by the user
    searchBoxInstance.on(searchBoxInstance.Events.ResultClicked, function(result) {
      markersLayer.setMarkersData([result.data])
          .addMarkers();

      var viewport = result.data.viewport;
      if (viewport) {
          map.fitBounds([viewport.topLeftPoint, viewport.btmRightPoint]);
      } else {
          map.fitBounds(markersLayer.getBounds());
      }
    });
  }
}
function createMap() {
  return tomtom.L.map('map', {
    key: '<api-key>',
    basePath: '/src/assets/sdk',
    center: [52.360306, 4.876935],
    zoom: 15,
    source: 'vector',
    glyphsUrl: "https://api.tomtom.com/maps-sdk-js/glyphs/v1/{fontstack}/{range}.pbf",
    spriteUrl: "https://api.tomtom.com/maps-sdk-js/sprites/v1/sprite"
  });
}
