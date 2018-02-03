import { Component, OnInit, ViewChild } from '@angular/core';
import { ILeg } from '../shared/leg.class';
import { PropertiesLocalService } from '../shared/properties-local.service';
import { IProperties } from '../shared/properties.class';
import { GridComponent } from '@syncfusion/ej2-ng-grids';

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

  constructor(private propertiesLocalService: PropertiesLocalService) {
    this.loaded = false;

    this.properties = {
      fuel: 100,
      trueAirspeed: 150,
      windDirection: 0,
      windSpeed: 0,
      fuelUse: 15
    };

    this.datasource = [
      {
        from: 'EBUL',
        to: 'EBZU',
        trueHeading: 298,
        distance: 26,
        heading: 0,
        groundSpeed: 0,
        timeNeeded: 0,
        fuelNeeded: 0
      },
      {
        from: 'EBZU',
        to: 'EBMO',
        trueHeading: 179,
        distance: 44,
        heading: 0,
        groundSpeed: 0,
        timeNeeded: 0,
        fuelNeeded: 0
      },
      {
        from: 'EBMO',
        to: 'EBAM',
        trueHeading: 117,
        distance: 28,
        heading: 0,
        groundSpeed: 0,
        timeNeeded: 0,
        fuelNeeded: 0
      },
      {
        from: 'EBAM',
        to: 'EBGG',
        trueHeading: 85,
        distance: 26,
        heading: 0,
        groundSpeed: 0,
        timeNeeded: 0,
        fuelNeeded: 0
      },
      {
        from: 'EBGG',
        to: 'EBUL',
        trueHeading: 329,
        distance: 52,
        heading: 0,
        groundSpeed: 0,
        timeNeeded: 0,
        fuelNeeded: 0
      }
    ];

    this.propertiesLocalService.getProperties().subscribe((properties: IProperties) => {
      this.properties = properties;
      this.calculateFlight();
      this.refreshGrid();
    });
  }

  ngOnInit() { }

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
      this.grid.refresh();
    }
  }
}


