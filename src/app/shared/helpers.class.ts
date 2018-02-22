export function DegreesToRadians(degrees: number): number {
  return (degrees / 360) * (Math.PI * 2);
}

export function RadiansToDegrees(radians: number): number {
  return radians / (Math.PI * 2) * 360;
}
