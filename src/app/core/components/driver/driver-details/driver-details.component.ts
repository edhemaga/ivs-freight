import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverCdlModalComponent } from '../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { ModalService } from './../../shared/ta-modal/modal.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverTService } from '../state/driver.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { DriversMinimalListStore } from '../state/driver-details-minimal-list-state/driver-minimal-list.store';
import { DriversMinimalListQuery } from '../state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { CdlTService } from '../state/cdl.service';
import { Subject, take, takeUntil } from 'rxjs';
import { DriversDetailsListQuery } from '../state/driver-details-list-state/driver-details-list.query';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { DriversDetailsListStore } from '../state/driver-details-list-state/driver-details-list.store';
import { DriversItemStore } from '../state/driver-details-state/driver-details.store';
import moment from 'moment';

@Component({
    selector: 'app-driver-details',
    templateUrl: './driver-details.component.html',
    styleUrls: ['./driver-details.component.scss'],
    providers: [DetailsPageService],
})

export class DriverDetailsComponent implements OnInit, OnDestroy {
    public driverDetailsConfig: any[] = [];
    public dataTest: any;
    public statusDriver: boolean;
    public data: any;
    public showInc: boolean;
    public hasDangerCDL: boolean;
    public arrayCDL: any[] = [];
    public arrayMedical: any[] = [];
    public arrayMvrs: any[] = [];
    public hasDangerMedical: boolean;
    public hasDangerMvr: boolean;
    public driverId: number = null;
    public driverObject: any;
    public driversList: any = this.driverMinimalQuery.getAll();
    public currentIndex: number = 0;
    public arrayActiveCdl: any[] = [];
    public isActiveCdl: boolean;
    public dataCdl: any;
    public cdlActiveId: number;
    private destroy$ = new Subject<void>();
    private newDriverId: number;
    constructor(
        private activated_route: ActivatedRoute,
        private modalService: ModalService,
        private driverService: DriverTService,
        private router: Router,
        private notificationService: NotificationService,
        private detailsPageDriverService: DetailsPageService,
        private cdRef: ChangeDetectorRef,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private driverMinimimalListStore: DriversMinimalListStore,
        private driverMinimalQuery: DriversMinimalListQuery,
        private dropDownService: DropDownService,
        private driverDQuery: DriversDetailsListQuery,
        private cdlService: CdlTService,
        private DetailsDataService: DetailsDataService,
        private DriversDetailsListStore: DriversDetailsListStore,
        private DriversItemStore: DriversItemStore
    ) {

        let storeData$ = this.DriversItemStore._select(state => state);

        storeData$.subscribe(state => {
            
            let newDriverData = {...state.entities[this.newDriverId]};

            if ( !this.isEmpty(newDriverData) ) {  
                this.DetailsDataService.setNewData(newDriverData);
                this.detailCongif(newDriverData);
                this.initTableOptions(newDriverData);
            }
          });
    }

    ngOnInit() {
        let dataId = this.activated_route.snapshot.params.id;
        let driverData = {
            ...this.DriversItemStore?.getValue()?.entities[dataId],
        };

        this.currentIndex = this.driversList.findIndex(
            (driver) => driver.id === driverData.id
        );

        this.detailCongif(driverData);
        if (this.cdlActiveId > 0) {
            this.getCdlById(this.cdlActiveId);
        }
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.detailCongif(res.data);
                    this.initTableOptions(res.data);
                    this.checkExpiration(res.data);
                    if (this.cdlActiveId > 0) {
                        this.getCdlById(this.cdlActiveId);
                    }
                    this.cdRef.detectChanges();
                }
            });

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'driver') {
                                this.deleteDriverById(res.id);
                            }
                            break;
                        }
                        case 'activate': {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case 'info': {
                            //console.log('---res----', res);
                            //console.log('---res----', this.DetailsDataService.cdlId);
                            if (res.cdlStatus === 'New') {
                                //console.log('---res.data', res.data);
                                let driverId = res.data.data.id ? res.data.data.id : res.data.driver.id;
                                console.log("---driverId-", driverId);
                                console.log("---CDL ID-", res.data.id);
                                console.log('---this.DetailsDataService.cdlId----', this.DetailsDataService.cdlId);
                                this.deactivateCdl(res.data.id, driverId);
                                if ( this.DetailsDataService.cdlId != res.data.id) {
                                    setTimeout(()=>{
                                        this.activateCdl(this.DetailsDataService.cdlId);
                                    }, 1000);
                                    
                                }
                            } else {
                                this.activateCdl(res.data.id);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });

        this.detailsPageDriverService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.driverDQuery.hasEntity(id)) {
                    query = this.driverDQuery.selectEntity(id).pipe(take(1));
                    query.subscribe({
                        next: (res: any) => {
                            this.currentIndex = this.driversList.findIndex(
                                (driver) => driver.id === res.id
                            );
                            this.initTableOptions(res);
                            if (this.cdlActiveId > 0) {
                                this.getCdlById(this.cdlActiveId);
                            }
                            this.detailCongif(res);
                            this.newDriverId = id;
                            if (this.router.url.includes('details')) {
                                this.router.navigate([`/driver/${res.id}/details`]);
                            }
    
                            this.cdRef.detectChanges();
                        },
                        error: () => {},
                    });

                } else {
                    //query = this.driverService.getDriverById(id);
                    this.newDriverId = id;
                    this.router.navigate([`/driver/${id}/details`]);
                    this.cdRef.detectChanges();        
                }
                
            });
    }

    public isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
      }

    /**Function template and names for header and other options in header */
    public detailCongif(dataDriver: any) {
        this.DetailsDataService.setNewData(dataDriver);
        this.driverObject = dataDriver;
        this.initTableOptions(dataDriver);
        this.checkExpiration(dataDriver);

        if (dataDriver?.status == 0) {
            this.statusDriver = true;
            this.showInc = true;
        } else {
            this.statusDriver = false;
            this.showInc = false;
        }

        this.driverDetailsConfig = [
            {
                id: 0,
                name: 'Driver Details',
                template: 'general',
                data: dataDriver,
            },
            {
                id: 1,
                name: 'CDL',
                template: 'cdl',
                req: false,
                status: this.statusDriver,
                hasDanger: this.hasDangerCDL,
                length: dataDriver?.cdls?.length ? dataDriver.cdls.length : 0,
                data: dataDriver,
            },
            {
                id: 2,
                name: 'Drug & Alcohol Test',
                template: 'drug-alcohol',
                req: true,
                status: this.statusDriver,
                hasDanger: false,
                length: dataDriver?.tests?.length ? dataDriver.tests.length : 0,
                data: dataDriver.tests,
            },
            {
                id: 3,
                name: 'Medical',
                template: 'medical',
                req: false,
                status: this.statusDriver,
                hasDanger: this.hasDangerMedical,
                length: dataDriver?.medicals?.length
                    ? dataDriver.medicals.length
                    : 0,
                data: dataDriver.medicals,
            },
            {
                id: 4,
                name: 'MVR',
                template: 'mvr',
                req: true,
                status: this.statusDriver,
                hasDanger: this.hasDangerMvr,
                length: dataDriver?.mvrs?.length ? dataDriver.mvrs.length : 0,
                data: dataDriver.mvrs,
            },
        ];
        this.driverId = dataDriver?.id ? dataDriver.id : null;
    }
    checkExpiration(data: any) {
        this.hasDangerCDL = false;
        this.hasDangerMedical = false;
        this.hasDangerMvr = false;
        this.arrayCDL = [];
        this.arrayMedical = [];
        this.arrayMvrs = [];

        data?.cdls?.map((el) => {
            if (moment(el.expDate).isAfter(moment())) {
                this.arrayCDL.push(false);
            }
            if (moment(el.expDate).isBefore(moment())) {
                this.arrayCDL.push(true);
            }
        });

        data?.medicals?.map((el) => {
            if (moment(el.expDate).isAfter(moment())) {
                this.arrayMedical.push(false);
            }
            if (moment(el.expDate).isBefore(moment())) {
                this.arrayMedical.push(true);
            }
        });

        if(data.mvrs?.length>0){
        data?.mvrs.map((el)=>{
            if(moment(el.issueDate).isAfter(moment())){
            this.arrayMedical.push(false)
            }
           if(moment(el.issueDate).isBefore(moment())){
                    this.arrayMedical.push(true)
             }
            })
        }
        if (this.arrayCDL.includes(false)) {
            this.hasDangerCDL = false;
        } else {
            this.hasDangerCDL = true;
        }
        if (this.arrayMedical.includes(false)) {
            this.hasDangerMedical = false;
        } else {
            this.hasDangerMedical = true;
        }
    }

    /**Function for dots in cards */
    public initTableOptions(data: any): void {
        this.arrayActiveCdl = [];
        this.isActiveCdl = false;
        this.cdlActiveId = 0;
        data?.cdls?.map((item) => {
           if (item.status == 1) {
                this.cdlActiveId = item.id;
                this.arrayActiveCdl.push(true);
                this.isActiveCdl = true;
            } else {
                this.arrayActiveCdl.push(false);
                this.isActiveCdl = false;
            }
        });
        this.dataTest = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    disabled: data.status == 0 ? true : false,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Send Message',
                    name: 'dm',
                    svg: 'assets/svg/common/ic_dm.svg',
                    show: data.status == 1 ? true : false,
                    disabled: data.status == 0 ? true : false,
                    iconName: 'dm',
                },
                {
                    title: 'Add New',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    iconName: 'add-new',
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        { subName: 'CDL', actionName: 'CDL' },
                        {
                            subName: 'Test (Drug, Alcohol)',
                            actionName: 'Drug & Alcohol Test',
                        },
                        { subName: 'Medical Exam', actionName: 'Medical' },
                        { subName: 'MVR', actionName: 'MVR' },
                    ],
                },
                {
                    title: 'Request',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    iconName: 'add-new',
                    disabled: data.status == 0 ? true : false,
                    subType: [
                        {
                            subName: 'Background Check',
                            actionName: 'Background Check',
                        },
                        { subName: 'Medical Exam', actionName: 'Medical' },
                        {
                            subName: 'Test (Drug, Alcohol)',
                            actionName: 'Drug & Alcohol Test',
                        },
                        { subName: 'MVR', actionName: 'MVR' },
                    ],
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: data.status == 1 || data.status == 0 ? true : false,
                },
                {
                    title: 'border',
                },
                {
                    title: data.status == 0 ? 'Activate' : 'Deactivate',
                    name: data.status == 0 ? 'activate' : 'deactivate',
                    iconName: 'activate-item',
                    svg: 'assets/svg/common/ic_deactivate.svg',
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: data.status == 1 ? true : false,
                    blueIcon: data.status == 0 ? true : false,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
                    danger: true,
                    show: data.status == 1 || data.status == 0 ? true : false,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    public getCdlById(id: number) {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataCdl = item));
    }
    public onDriverActions(event: any) {
        this.dropDownService.dropActionsHeader(
            event,
            this.driverObject,
            event.id
        );
    }

    private changeDriverStatus(id: number) {
        let status = this.driverObject.status == 0 ? 'inactive' : 'active';
        this.driverService
            .changeDriverStatus(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteDriverById(id: number) {
        let status = this.driverObject.status == 0 ? 'inactive' : 'active';
        let last = this.driversList.at(-1);
        if (
            last.id ===
            this.driverMinimimalListStore.getValue().ids[this.currentIndex]
        ) {
            this.currentIndex = --this.currentIndex;
        } else {
            this.currentIndex = ++this.currentIndex;
        }
        this.driverService
            .deleteDriverByIdDetails(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (
                        this.driverMinimimalListStore.getValue().ids.length >= 1
                    ) {
                        this.router.navigate([
                            `/driver/${
                                this.driversList[this.currentIndex].id
                            }/details`,
                        ]);
                    }
                },
                error: () => {
                    this.router.navigate(['/driver']);
                },
            });
    }
    private deactivateCdl(id: number, driverId: number) {
        this.cdlService
            .deactivateCdlById(id, driverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private activateCdl(id: number) {
        this.cdlService
            .activateCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
    public onModalAction(action: string): void {
        if (action.includes('Drug')) {
            action = 'DrugAlcohol';
        }

        switch (action) {
            case 'CDL': {
                console.log('----here-----')
                if (!this.arrayActiveCdl.includes(true)) {
                    this.modalService.openModal(
                        DriverCdlModalComponent,
                        { size: 'small' },
                        { id: this.driverId, type: 'new-licence' }
                    );
                } else {
                    this.modalService.openModal(
                        DriverCdlModalComponent,
                        { size: 'small' },
                        { id: this.driverId, type: 'new-licence' }
                    );
                    /*
                    const data = {
                        ...this.driverObject,
                        data: {
                            firstName: this.driverObject?.firstName,
                            lastName: this.driverObject?.lastName,
                        },
                    };
                    const mappedEvent = {
                        ...this.dataCdl,
                        data: {
                            state: this.dataCdl?.state?.stateShortName,
                            expDate: this.dataCdl?.expDate,
                            cdlNumber: this.dataCdl?.cdlNumber,
                        },
                    };
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            data: {
                                ...this.dataCdl,
                                state: this.dataCdl?.state?.stateShortName,
                                data,
                            },
                            template: 'cdl',
                            type: 'info',
                            subType: 'cdl void',
                            cdlStatus: 'New',
                            modalHeader: true,
                        }
                    );
                    */
                }
                break;
            }
            case 'DrugAlcohol': {
                this.modalService.openModal(
                    DriverDrugAlcoholModalComponent,
                    { size: 'small' },
                    { id: this.driverId, type: 'new-drug' }
                );

                break;
            }
            case 'Medical': {
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: 'small' },
                    { id: this.driverId, type: 'new-medical' }
                );
                break;
            }
            case 'MVR': {
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: 'small' },
                    { id: this.driverId, type: 'new-mvr' }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    /**Function retrun id */
    public identity(index: number, item: any): number {
        return index;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
