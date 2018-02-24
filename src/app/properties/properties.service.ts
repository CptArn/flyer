import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiKeys } from '../../api.keys';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PropertiesService {
  constructor(private httpClient: HttpClient) {
  }

  public GetLiveWeather(): Observable<any> {
    return this.httpClient.get(`http://api.openweathermap.org/data/2.5/weather?q=ursel&appid=${ApiKeys.openweathermap}`);
  }
}
