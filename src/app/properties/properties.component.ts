import { Component, OnInit } from '@angular/core';
import { PropertiesLocalService } from '../shared/properties-local.service';
import { IProperties } from '../shared/properties.class';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  public windSpeed: number;
  public windDirection: number;
  public indicatedSpeed: number;
  public fuelUse: number;
  constructor(private propertiesLocalService: PropertiesLocalService) {
    this.windSpeed = 0;
    this.windDirection = 0;
    this.indicatedSpeed = 150;
    this.fuelUse = 15;

    this.setProperties();
  }

  ngOnInit() { }

  private setProperties() {
    const properties: IProperties = {
      fuel: 40,
      trueAirspeed: this.indicatedSpeed,
      windDirection: this.windDirection,
      windSpeed: this.windSpeed,
      fuelUse: this.fuelUse,
      minuteLength: 2
    }

    this.propertiesLocalService.setProperties(properties);
  }
}
