export interface GpsLastPositionsDataModel {
   eventDateTime: String;
   uniqueId: String;
   truckNumber: String;
   driverFullName: String;
   trailerNumber: String;
   latitude: DoubleRange;
   longitude: DoubleRange;
   altitude: DoubleRange;
   speed: DoubleRange;
   motion: BigInt;
}
