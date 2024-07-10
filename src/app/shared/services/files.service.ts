import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

// services
import {
    DriverService,
    RepairShopService,
    OwnerService,
    RepairService,
    TrailerService,
    TruckService,
    LoadService,
} from 'appcoretruckassist';
@Injectable({
    providedIn: 'root',
})
export class FilesService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private driverService: DriverService,
        private repairShopService: RepairShopService,
        private ownerService: OwnerService,
        private repairService: RepairService,
        private trailerService: TrailerService,
        private truckService: TruckService,
        private loadService: LoadService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getFiles(entity: string, id: number) {
        switch (entity) {
            case 'driver':
                return this.getDriverFiles(id);
            case 'load':
                return this.getLoadFiles(id);
            case 'repair':
                return this.getRepairFiles(id);
            case 'repair-shop':
                return this.getRepairShopFiles(id);
            case 'owner':
                return this.getOwnerFiles(id);
            case 'trailer':
                return this.getTrailerFiles(id);
            case 'truck':
                return this.getTruckFiles(id);
            default:
                break;
        }
    }

    public getDriverFiles(id: number) {
        return this.driverService.apiDriverFilesIdGet(id);
    }
    public getLoadFiles(id: number) {
        return this.loadService.apiLoadFilesIdGet(id);
    }

    public getRepairShopFiles(id: number) {
        return this.repairShopService.apiRepairshopFilesIdGet(id);
    }

    public getRepairFiles(id: number) {
        return this.repairService.apiRepairFilesIdGet(id);
    }

    public getOwnerFiles(id: number) {
        return this.ownerService.apiOwnerFilesIdGet(id);
    }

    public getTrailerFiles(id: number) {
        return this.trailerService.apiTrailerFilesIdGet(id);
    }

    public getTruckFiles(id: number) {
        return this.truckService.apiTruckFilesIdGet(id);
    }
}
