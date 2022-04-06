/* Live Data */
export class GpsDeviceData {
  altitude: number;
  companyId: number;
  course: string;
  createdAt: string;
  deviceId: number;
  deviceStatus: any;
  distance: number;
  driverFullName: string;
  driverId: number;
  eventDateTime: string;
  eventId: number;
  eventType: any;
  extendedStop: number;
  hours: number;
  id: number;
  ignition: number;
  latitude: number;
  longitude: number;
  motion: number;
  parking: number;
  seconds: number;
  shortStop: number;
  speed: number;
  totalDistance: number;
  trailerId: number;
  trailerNumber: string;
  truckId: number;
  truckNumber: string;
  truckloadId: number;
  uniqueId: string;
}

/* History Log */
export class HistoryLogData {
  data: HistoryGpsDeviceData[];
  drivingTime: number;
  extendedStopTime: number;
  idleTime: number;
  stopTime: number;
  stops: HistoryStop[];
}

export class HistoryGpsDeviceData {
  id: number;
  deviceId: number;
  uniqueId: string;
  companyId: number;
  truckId: number;
  truckNumber: string;
  driverId: number;
  driverFullName: string;
  trailerId: number;
  trailerNumber: string;
  truckloadId: number;
  deviceStatus: string;
  ignition: number;
  motion: number;
  stop: number;
  idle: number;
  extendedStop: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  eventDateTime: string;
  eventType: any;
  distance: number;
  totalDistance: number;
  seconds: number;
  createdAt: string;
}

export class HistoryStop {
  endDateTime: string;
  id: number;
  leg: number;
  location: string;
  startDateTime: string;
  total: number;
  typeOfStop: string;
}

export class HistoryMarkers {
  latitude: number;
  longitude: number;
  icon: string;
  course: string;
}
