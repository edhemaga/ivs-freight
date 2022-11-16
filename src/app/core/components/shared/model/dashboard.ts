export class Data {
  email: string;
  firstname: string;
  id: number;
  lastName: string;
}

export class Dashboard {
  status: string;
  data: Data;
}

export class DashboardStats {
  driverTotal: number;
  truckTotal: number;
  trailerTotal: number;
  dispatcherTotal: number;
  customerTotal: number;
  loadTotal: number;
}
