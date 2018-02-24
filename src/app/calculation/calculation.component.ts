import { Component, OnInit, ViewChild } from '@angular/core';
import { ILeg } from '../shared/leg.class';
import { PropertiesLocalService } from '../shared/properties-local.service';
import { IProperties } from '../shared/properties.class';
import { GridComponent } from '@syncfusion/ej2-ng-grids';
import * as L from 'leaflet';
import 'leaflet-draw';
import { latLng } from 'leaflet';
import { along, midpoint } from '@turf/turf';
import { lineString } from '@turf/turf';
import { DegreesToRadians, RadiansToDegrees } from '../shared/helpers.class';
import { ElectronService } from '../providers/electron.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit {
  public datasource: ILeg[];
  public properties: IProperties;
  @ViewChild(GridComponent) public grid: GridComponent;
  public loaded: boolean;
  private map: L.Map;
  private route: L.FeatureGroup;
  private minuteLines: L.FeatureGroup;

  constructor(private propertiesLocalService: PropertiesLocalService, private electronService: ElectronService) {
    this.loaded = false;
    this.route = new L.FeatureGroup();
    this.minuteLines = new L.FeatureGroup();

    this.properties = {
      fuel: 100,
      trueAirspeed: 150,
      windDirection: 0,
      windSpeed: 0,
      fuelUse: 15,
      minuteLength: 2
    };

    this.datasource = [];

    this.propertiesLocalService.getProperties().subscribe((properties: IProperties) => {
      this.properties = properties;
      this.refreshGrid();
    });
  }

  public dataBound() {
    if (!this.loaded) {
      this.loaded = true;
      this.refreshGrid();
    }
  }

  public calculateFlight(): void {
    // adjust wind direction
    const windDirection = (this.properties.windDirection + 180) % 360;

    this.datasource.forEach((leg: ILeg) => {
      const windTrackAngle = DegreesToRadians(leg.trueHeading - windDirection);
      const sinWindCorrectionAngule = this.properties.windSpeed * Math.sin(windTrackAngle) / this.properties.trueAirspeed;
      const windCorrectionAngule = Math.asin(sinWindCorrectionAngule);
      leg.heading = Math.round(leg.trueHeading + RadiansToDegrees(windCorrectionAngule));
      leg.groundSpeed = Math.round(this.properties.trueAirspeed * Math.cos(windCorrectionAngule) + this.properties.windSpeed * Math.cos(windTrackAngle));

      leg.timeNeeded = Math.round(leg.distance / leg.groundSpeed * 60);
      leg.fuelNeeded = Math.round(this.properties.fuelUse / 60 * leg.timeNeeded);
    });
  }

  private refreshGrid() {
    if (this.loaded) {
      this.grid.refresh();
    }

    this.calculateFlight();
    this.drawMinuteLines();
  }

  public actionComplete(event: any) {
    if (event.requestType === 'save') {
      this.refreshGrid();
    }
  }

  public ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.

    let openStreetMap: L.TileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 10});
    let googleSatelite: L.TileLayer = new L.TileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    let openFlightMap: L.TileLayer = new L.TileLayer('assets/512/latest/{z}/{x}/{y}.png');

    this.map = L.map('map', {
      center: [51.135, 3.50],
      zoom: 10,
      maxZoom: 10,
      minZoom: 5,
      layers: [openStreetMap, googleSatelite, openFlightMap]
    });

    let baseMaps = {
      'Google Satellite': googleSatelite,
      'Open Street Map': openStreetMap
    };

    let overlayMaps = {
      'OpenFlightMap': openFlightMap
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

     // FeatureGroup is to store editable layers
    this.map.addLayer(this.route);
    this.map.addLayer(this.minuteLines);

    const drawControl = new L.Control.Draw({
         edit: {
          featureGroup: this.route
         },
         draw: {
           circle: false,
           circlemarker: false,
           marker: false,
           polygon: false,
           rectangle: false
         }
    });

    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (e?: any) => {
      // new line
      this.redraw(e);
    });

    this.map.on(L.Draw.Event.EDITSTART, () => {
      this.clearMintueLines();
    });

    this.map.on(L.Draw.Event.EDITED, (e?: any) => {
      this.redraw({layer: e.layers._layers[Object.keys(e.layers._layers)[0]]});
    });

    this.map.on(L.Draw.Event.DELETED, () => {
      // deleted
      this.datasource = [];
      this.clearMintueLines();
      this.calculateFlight();
    });
  }

  private redraw(e?: any) {
    if (e) {
      this.convertDrawEventToRoute(e);
    }

    this.calculateFlight();
    this.drawMinuteLines();
  }

  private convertDrawEventToRoute(e: any) {
    const layer: L.Layer = e.layer;
    layer.addTo(this.route);
    const tempData: any = [];

    const arrayLength: number = e.layer._latlngs.length;
    for (let i = 0; i < arrayLength - 1; i++) {
      const angleDeg = (Math.atan2(e.layer._latlngs[(i + 1)].lng - e.layer._latlngs[i].lng, e.layer._latlngs[(i + 1)].lat - e.layer._latlngs[i].lat) * 180 / Math.PI + 360 ) % 360;

      const R = 6371; // metres

      const φ1 = DegreesToRadians(e.layer._latlngs[i].lat);
      const φ2 = DegreesToRadians(e.layer._latlngs[(i + 1)].lat);
      const Δφ = DegreesToRadians(e.layer._latlngs[(i + 1)].lat - e.layer._latlngs[i].lat);
      const Δλ = DegreesToRadians(e.layer._latlngs[(i + 1)].lng - e.layer._latlngs[i].lng);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;

      const legToAdd: ILeg = {
        'from': String.fromCharCode(97 + i),
        'to': String.fromCharCode(98 + i),
        distance: Math.round(distance),
        trueHeading: Math.round(angleDeg),
        fromLatLng: e.layer._latlngs[i],
        toLatLng: e.layer._latlngs[(i + 1)],
      }

      tempData.push(legToAdd);
    }

    this.datasource = tempData;
  }

  private drawMinuteLines(): void {
    this.clearMintueLines();
    this.datasource.forEach((leg: ILeg) => {
      const layer = new L.LayerGroup();

      const minuteSegments = Math.floor(leg.timeNeeded / this.properties.minuteLength);
      const legDistanceMinute = leg.distance / leg.timeNeeded;
      const lineStringTest = lineString([[leg.fromLatLng['lng'], leg.fromLatLng['lat']], [leg.toLatLng['lng'], leg.toLatLng['lat']]]);

      for (let i = 0; i < minuteSegments; i++) {
        const calc = along(lineStringTest, legDistanceMinute * (i + 1) * this.properties.minuteLength, {});

        L.marker(latLng(calc.geometry.coordinates[1], calc.geometry.coordinates[0]), {
          icon: L.divIcon({className: 'minute-marker'}),
          rotationAngle: (leg.trueHeading + 90) % 360
        } as any).addTo(layer);
      }

      layer.addTo(this.minuteLines);

    });
  }

  private clearMintueLines(): void {
    this.minuteLines.clearLayers();
  }

  public exportToGPX(): string {
    let gpxfile = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="flyer">
          <metadata>
              <name>Export by flyer</name>
          </metadata>
          <rte>
              <name>Test Export</name>
              {{routeData}}
          </rte>
      </gpx>
    `;

    let dataString = '';


    this.datasource.forEach((leg: ILeg) => {
      dataString += `
        <rtept lon="${leg.fromLatLng['lng']}" lat="${leg.fromLatLng['lat']}">
            <ele>0.0</ele>
            <name>${leg.from}</name>
        </rtept>
        <rtept lon="${leg.toLatLng['lng']}" lat="${leg.toLatLng['lat']}">
            <ele>0.0</ele>
            <name>${leg.to}</name>
        </rtept>
      `;
    });

    gpxfile = gpxfile.replace('{{routeData}}', dataString);

    return gpxfile;
  }

  private saveGPXFile(): void {
    this.electronService.ipcRenderer.send('route.save.gpx', this.exportToGPX());
  }

  public toolbarAction(event: any): void {
    if (event.item.id === 'gpx') {
      this.saveGPXFile();
    }
  }
}
