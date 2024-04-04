import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { DriverService } from '../../../../appcoretruckassist/api/driver.service';
import { RepairShopService } from '../../../../appcoretruckassist/api/repairShop.service';
import { OwnerService } from '../../../../appcoretruckassist/api/owner.service';
import { RepairService } from '../../../../appcoretruckassist/api/repair.service';
import { TrailerService } from '../../../../appcoretruckassist/api/trailer.service';
import { TruckService } from '../../../../appcoretruckassist/api/truck.service';

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
        private truckService: TruckService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getFiles(entity: string, id: number) {
        switch (entity) {
            case 'driver':
                return this.getDriverFiles(id);
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
