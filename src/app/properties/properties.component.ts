import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  public windSpeed: number;
  public windDirection: number;
  public indicatedSpeed: number;
  constructor() {
    this.windSpeed = 0;
    this.windDirection = 0;
    this.indicatedSpeed = 150;
  }

  ngOnInit() { }
}
