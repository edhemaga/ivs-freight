import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  /**
   * Get dashboard stats function
   */
  public getDashboardStats() {
    return this.http.get(environment.API_ENDPOINT + 'dashboard');
  }

  /**
   *  Get dashobard Stats New Function
   */

  public getDasboardMainTotals() {
    return this.http.get(environment.API_ENDPOINT + 'dashboard/totals');
  }

  /**
   * Get dashboard Chart Data
   */

  public getChartData(cat, per, intv) {
    return this.http.get(
      environment.API_ENDPOINT + `dashboard/charts/${cat}/${per}/${intv}`
    );
  }

  /**
   * Get Invoice Chart Data
   */
  public getInvoiceChartData() {
    return this.http.get(environment.API_ENDPOINT + 'dashboard/invoice');
  }
}
