import { Injectable } from '@angular/core';
import { DashboardStoreService } from '../components/dashboard/state/dashboard.service';
import { DispatcherStoreService } from '../components/dispatcher/state/dispatcher.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {

  constructor(
      private dashboardStoreService: DashboardStoreService, 
      private dispatcherStoreService: DispatcherStoreService
  ) {}

  getAllStoreValues(){
    this.dashboardStoreService.addStats();
    this.dispatcherStoreService.getDispatcherList();
  }

}
