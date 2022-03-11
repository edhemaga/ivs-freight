import { Injectable } from "@angular/core";
import { DashboardStore } from "./dashboard.store";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { SharedService } from "src/app/core/services/shared/shared.service";

@Injectable({ providedIn: "root" })
export class DashboardStoreService {
  constructor(private dashboardStore: DashboardStore, private http: HttpClient, private sharedService: SharedService) {}

  addStats() {
    this.http.get(environment.API_ENDPOINT + 'dashboard/totals').subscribe(
        (response: any) => {
        this.dashboardStore.update((store) => ({
            ...store,
            statistic: response
          }));
          console.log('dashboardStats:', response);
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }
}
