import { Component, OnInit } from '@angular/core';
import { ILeg } from '../shared/leg.class';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit {
  public datasource: ILeg[];
  constructor() {
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

    this.calculateFlight();
  }

  ngOnInit() { }

  public calculateFlight(): void {
    // init values
    const windSpeed = 46;
    const trueAirspeed = 150;
    const fuelUse = 15;

    // adjust wind direction
    const windDirection = (250 + 180) % 360;

    this.datasource.forEach((leg: ILeg) => {
      // wind to track angle
      const windTrackAngle = this.degreesToRadians(leg.trueHeading - windDirection);
      const sinWindCorrectionAngule = windSpeed * Math.sin(windTrackAngle) / trueAirspeed;
      const windCorrectionAngule = Math.asin(sinWindCorrectionAngule);
      leg.heading = Math.round(leg.trueHeading + this.radiansToDegrees(windCorrectionAngule));
      leg.groundSpeed = Math.round(trueAirspeed * Math.cos(windCorrectionAngule) + windSpeed * Math.cos(windTrackAngle));

      leg.timeNeeded = Math.round(leg.distance / leg.groundSpeed * 60);
      leg.fuelNeeded = Math.round(15 / 60 * leg.timeNeeded);
    });
  }

  private degreesToRadians(degrees: number): number {
    return (degrees / 360) * (Math.PI * 2);
  }

  private radiansToDegrees(radians: number): number {
    return radians / (Math.PI * 2) * 360;
  }
}


