import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IProperties } from './properties.class';
import { Subscribable } from 'rxjs/Observable';

@Injectable()
export class PropertiesLocalService {
  private currentSubject: ReplaySubject<IProperties>;

  constructor() {
    this.currentSubject = new ReplaySubject(1);
  }

  public getProperties(): Subscribable<IProperties> {
    return this.currentSubject;
  }

  public setProperties(properties: IProperties) {
    this.currentSubject.next(properties);
  }

}
