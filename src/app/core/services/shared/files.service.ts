import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { DriverService } from './../../../../../appcoretruckassist/api/driver.service';
import { RepairShopService } from './../../../../../appcoretruckassist/api/repairShop.service';
import { OwnerService } from './../../../../../appcoretruckassist/api/owner.service';
import { RepairService } from './../../../../../appcoretruckassist/api/repair.service';

@Injectable({
    providedIn: 'root',
})
export class FilesService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private driverService: DriverService, private repairShopService: RepairShopService, private ownerService: OwnerService, private repairService: RepairService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getFiles(entity: string, id: number) {
        console.log(entity, 'entity')
        switch (entity) {
            case 'Driver':
                return this.getDriverFiles(id);
            case 'Repair':
                return this.getRepairFiles(id);
            case 'Repair-Shop':
                return this.getRepairShopFiles(id);
            case 'Owner':
                return this.getOwnerFiles(id);
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
}
