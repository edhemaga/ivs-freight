import { Injectable } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';
import { RepairShopService } from '../../../../../../../appcoretruckassist/api/repairShop.service';
import { RepairDStore } from './repair-d.store';
import { RepairListResponse } from '../../../../../../../appcoretruckassist/model/repairListResponse';
import { RepairShopMinimalResponse } from '../../../../../../../appcoretruckassist/model/repairShopMinimalResponse';

import { RepairService } from '../../../../../../../appcoretruckassist/api/repair.service';
import { RepairedVehicleListResponse } from '../../../../../../../appcoretruckassist/model/repairedVehicleListResponse';
import { RepairShopMinimalListResponse } from '../../../../../../../appcoretruckassist/model/repairShopMinimalListResponse';
import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { RepairDQuery } from './repair-d.query';

@Injectable({
   providedIn: 'root',
})
export class RepairDService {
   public currentIndex: number;
   public repairShopList: any;
   public repairShopId: number;
   private destroy$ = new Subject<void>();
   constructor(
      private repairShopService: RepairShopService,
      private repairService: RepairService,
      private repairDStore: RepairDStore,
      private rDq: RepairDQuery
   ) {}

   // Get Repair List
   public getRepairList(
      repairShopId?: number,
      unitType?: number,
      dateFrom?: string,
      dateTo?: string,
      isPM?: number,
      categoryIds?: Array<number>,
      pmTruckTitles?: Array<string>,
      pmTrailerTitles?: Array<string>,
      isOrder?: boolean,
      pageIndex?: number,
      pageSize?: number,
      companyId?: number,
      sort?: string,
      search?: string,
      search1?: string,
      search2?: string
   ): Observable<RepairListResponse> {
      return this.repairService.apiRepairListGet(
         repairShopId,
         unitType,
         dateFrom,
         dateTo,
         isPM,
         categoryIds,
         pmTruckTitles,
         pmTrailerTitles,
         isOrder,
         pageIndex,
         pageSize,
         companyId,
         sort,
         search,
         search1,
         search2
      );
   }

   // Get Repair Minimal List
   public getRepairShopMinimalList(
      pageIndex?: number,
      pageSize?: number,
      companyId?: number
   ): Observable<RepairShopMinimalListResponse> {
      return this.repairShopService.apiRepairshopListMinimalGet(
         pageIndex,
         pageSize,
         companyId
      );
   }
   //get repreidVehicle list
   public getRepairedVehicle(
      repairShopId?: number,
      pageIndex?: number,
      pageSize?: number
   ): Observable<RepairedVehicleListResponse> {
      return this.repairShopService.apiRepairshopRepairedvehicleGet(
         repairShopId,
         pageIndex,
         pageSize
      );
   }
   set updateRepairShop(data: RepairShopResponse) {
      const repairShop: RepairShopResponse[] = Object.assign(
         [],
         this.repairDStore.getValue().repairShop
      );

      const index = repairShop.findIndex((item) => item.id === data.id);

      if (index === -1) {
         this.repairDStore.update((store) => {
            return {
               ...store,
               repairShop: [...store.repairShop, data],
            };
         });
      } else {
         repairShop[index] = data;

         this.repairDStore.update((store) => {
            return {
               ...store,
               repairShop: repairShop,
            };
         });
      }
   }

   set updateRepairList(data: RepairListResponse) {
      this.repairDStore.update((store) => {
         return {
            ...store,
            repairList: data,
         };
      });
   }

   set updateRepairedVehicleList(data: RepairedVehicleListResponse) {
      this.repairDStore.update((store) => {
         return {
            ...store,
            repairedVehicleList: data,
         };
      });
   }

   set updateRepairShopMinimal(data: RepairShopMinimalResponse) {
      this.repairDStore.update((store) => {
         return {
            ...store,
            repairShopMinimal: data,
         };
      });
   }
}
