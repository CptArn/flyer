import { Component, OnInit, ViewChild } from '@angular/core';
import { ILeg } from '../shared/leg.class';
import { PropertiesLocalService } from '../shared/properties-local.service';
import { IProperties } from '../shared/properties.class';
import { GridComponent } from '@syncfusion/ej2-ng-grids';
import * as L from 'leaflet';
import 'leaflet-draw';
import { latLng } from 'leaflet';
import { LatLng } from 'leaflet';

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
  private layerGroup: L.LayerGroup;

  constructor(private propertiesLocalService: PropertiesLocalService) {
    this.loaded = false;

    this.properties = {
      fuel: 100,
      trueAirspeed: 150,
      windDirection: 0,
      windSpeed: 0,
      fuelUse: 15,
      minuteLength: 2
    };

    this.datasource = [];

    this.layerGroup = new L.LayerGroup();

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
      const windTrackAngle = this.degreesToRadians(leg.trueHeading - windDirection);
      const sinWindCorrectionAngule = this.properties.windSpeed * Math.sin(windTrackAngle) / this.properties.trueAirspeed;
      const windCorrectionAngule = Math.asin(sinWindCorrectionAngule);
      leg.heading = Math.round(leg.trueHeading + this.radiansToDegrees(windCorrectionAngule));
      leg.groundSpeed = Math.round(this.properties.trueAirspeed * Math.cos(windCorrectionAngule) + this.properties.windSpeed * Math.cos(windTrackAngle));

      leg.timeNeeded = Math.round(leg.distance / leg.groundSpeed * 60);
      leg.fuelNeeded = Math.round(this.properties.fuelUse / 60 * leg.timeNeeded);
    });
  }

  private degreesToRadians(degrees: number): number {
    return (degrees / 360) * (Math.PI * 2);
  }

  private radiansToDegrees(radians: number): number {
    return radians / (Math.PI * 2) * 360;
  }

  private refreshGrid() {
    if (this.loaded) {
      this.calculateFlight();
      this.grid.refresh();
    }
  }

  public actionComplete(event: any) {
    if (event.requestType === 'save') {
      this.refreshGrid();
    }
  }

  public ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.

    this.map = L.map('map', {
      center: [51.135, 3.50],
      zoom: 10
    });

    this.map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 10}));
    this.map.addLayer(new L.TileLayer('assets/512/latest/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 10}));

     // FeatureGroup is to store editable layers
     const drawnItems = new L.FeatureGroup();
     this.map.addLayer(drawnItems);
     const drawControl = new L.Control.Draw({
         edit: {
             featureGroup: drawnItems
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

     this.map.on(L.Draw.Event.CREATED, (e: any) => {
      const type = e.layerType;
      const layer = e.layer;
      console.log(e);


      const tempData: any = [];

      const arrayLength: number = e.layer._latlngs.length;
      for (let i = 0; i < arrayLength - 1; i++) {
        const angleDeg = (Math.atan2(e.layer._latlngs[(i + 1)].lng - e.layer._latlngs[i].lng, e.layer._latlngs[(i + 1)].lat - e.layer._latlngs[i].lat) * 180 / Math.PI + 360 ) % 360;

        const R = 6371; // metres
        const φ1 = this.degreesToRadians(e.layer._latlngs[i].lat);
        const φ2 = this.degreesToRadians(e.layer._latlngs[(i + 1)].lat);
        const Δφ = this.degreesToRadians(e.layer._latlngs[(i + 1)].lat - e.layer._latlngs[i].lat);
        const Δλ = this.degreesToRadians(e.layer._latlngs[(i + 1)].lng - e.layer._latlngs[i].lng);

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
      this.calculateFlight();
      // this.refreshGrid();

      this.datasource.forEach((leg: ILeg) => {
        L.polyline([leg.fromLatLng, leg.toLatLng], {
          opacity: 1,
          color: 'black',
          smoothFactor: 0
        }).addTo(this.layerGroup);

        this.layerGroup.addTo(this.map);
      });
   });
  }
}


