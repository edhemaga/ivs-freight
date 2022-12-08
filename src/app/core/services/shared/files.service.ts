import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { DriverService } from './../../../../../appcoretruckassist/api/driver.service';

@Injectable({
    providedIn: 'root',
})
export class FilesService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private driverService: DriverService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getFiles(entity: string, id: number) {
        switch (entity) {
            case 'Driver':
                return this.getDriverFiles(id);
            default:
                break;
        }
        
    }

    public getDriverFiles(id: number) {
       return this.driverService.apiDriverFilesIdGet(id);
    }
}
