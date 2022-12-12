import { Injectable, OnDestroy } from '@angular/core';
import { DriverResponse, MedicalResponse, MedicalService } from 'appcoretruckassist';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class MedicalTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private medicalService: MedicalService,
        private driverService: DriverTService,
        private driverStore: DriversActiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    public deleteMedicalById(id: number): Observable<any> {
        return this.medicalService.apiMedicalIdDelete(id).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0]; 
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let indexNum;
                newData.medicals.map((reg: any, index: any) => {
                    if ( reg.id == id ) {
                        indexNum = index;
                    }
                })

                newData.medicals.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });
                
                this.dlStore.add(newData);
                this.driverItemStore.set([newData]);
            })
        );
    }

    public getMedicalById(id: number): Observable<MedicalResponse> {
        return this.medicalService.apiMedicalIdGet(id);
    }

    /* Observable<CreateMedicalResponse> */
    public addMedical(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.medicalService.apiMedicalPost().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let medicalApi = this.medicalService.apiMedicalIdGet(res.id).subscribe({
                    next: (resp: any) => {

                        newData.medicals.push(resp);
                       
                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        
                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                      
                        medicalApi.unsubscribe();
                    },
                }); 
            })
        );
    }

    public updateMedical(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.medicalService.apiMedicalPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let medicalApi = this.medicalService.apiMedicalIdGet(res.id).subscribe({
                    next: (resp: any) => {

                       
                        newData.medicals.map((reg: any, index: any) => {
                            if ( reg.id == resp.id ) {
                                newData.medicals[index] = resp;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        
                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                      
                        medicalApi.unsubscribe();
                    },
                });  
            })
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
