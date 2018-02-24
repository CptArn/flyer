import { Component, OnInit } from '@angular/core';
import { PropertiesLocalService } from '../shared/properties-local.service';
import { IProperties } from '../shared/properties.class';
import { PropertiesService } from './properties.service';

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
  public minuteLine: number;
  public useLiveWeather: boolean;
  public weather: any;

  constructor(private propertiesLocalService: PropertiesLocalService, private propertiesService: PropertiesService) {
    this.windSpeed = 0;
    this.windDirection = 0;
    this.indicatedSpeed = 150;
    this.fuelUse = 15;
    this.minuteLine = 2;
    this.useLiveWeather = false;
    this.weather = {};

    this.propertiesService.GetLiveWeather().subscribe((response: any) => {
      this.weather = response;
      this.useLiveWeather = true;
      this.setWindSpeed();
    });

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
      minuteLength: this.minuteLine
    }

    this.propertiesLocalService.setProperties(properties);
  }

  public setWindSpeed(): void {
    if (this.useLiveWeather) {
      this.windDirection = this.weather.wind.deg;
      this.windSpeed = this.weather.wind.speed * 1.852;
      this.setProperties();
    }
  }
}
