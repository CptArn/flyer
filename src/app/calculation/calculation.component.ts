import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit {
  public datasource: any;
  constructor() {
    this.datasource = [
      {
        from: 'EBUL',
        to: 'EBZU',
        trueHeading: 'xx',
        distance: 'xx',
        heading: 'xx',
        groundSpeed: 'xx',
        timeNeeded: 'xx',
        fuelNeeded: 'xx'
      },
      {
        from: 'EBZU',
        to: 'EBMO',
        trueHeading: '',
        distance: '',
        heading: '',
        groundSpeed: '',
        timeNeeded: '',
        fuelNeeded: ''
      },
      {
        from: 'EBMO',
        to: 'EBAM',
        trueHeading: '',
        distance: '',
        heading: '',
        groundSpeed: '',
        timeNeeded: '',
        fuelNeeded: ''
      },
      {
        from: 'EBAM',
        to: 'EBGG',
        trueHeading: '',
        distance: '',
        heading: '',
        groundSpeed: '',
        timeNeeded: '',
        fuelNeeded: ''
      },
      {
        from: 'EBGG',
        to: 'EBUL',
        trueHeading: '',
        distance: '',
        heading: '',
        groundSpeed: '',
        timeNeeded: '',
        fuelNeeded: ''
      },

    ];
  }

  ngOnInit() { }
}
