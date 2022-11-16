export class DriverRights {
  id?: number;
  applicantId?: string;
  understandYourRights: boolean;

  constructor(driverRights?: DriverRights) {
    this.id = driverRights?.id ? driverRights.id : undefined;
    this.applicantId = driverRights?.applicantId
      ? driverRights.applicantId
      : undefined;
    this.understandYourRights = driverRights?.understandYourRights
      ? driverRights.understandYourRights
      : false;
  }
}
