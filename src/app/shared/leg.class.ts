import { LatLngTuple } from 'leaflet';
export interface ILeg {
  from: String;
  to: String;
  trueHeading: number;
  distance: number;
  heading?: number;
  groundSpeed?: number;
  timeNeeded?: number;
  fuelNeeded?: number;
  fromLatLng: LatLngTuple;
  toLatLng: LatLngTuple;
}
