import { DriverTService } from './../state/driver.service';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { DriverResponse } from 'appcoretruckassist';
import { Router } from '@angular/router';
import { DriversDetailsQuery } from '../state/driver-details-state/driver-details.query';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { ImageBase64Service } from '../../../utils/base64.image';

@Component({
    selector: 'app-driver-card',
    templateUrl: './driver-card.component.html',
    styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() viewData: any;
    public selectedData: any;

    constructor(
        private driverService: DriverTService,
        private notificationService: NotificationService,
        private detailsPageDriverService: DetailsPageService,
        private driverDetailsQuery: DriversDetailsQuery,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit(): void {
        this.detailsPageDriverService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                this.driverDetailsQuery
                    .selectEntity(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res: DriverResponse) => {
                            this.selectedData = res;
                            if (this.router.url.includes('details')) {
                                this.router.navigate([
                                    `/driver/${res.id}/details`,
                                ]);
                            }
        
                            this.cdRef.detectChanges();
                        },
                        error: () => {
                        
                        },
                    });
            });
        this.transformImage();
    }
    public transformImage() {
        return this.imageBase64Service.sanitizer(
            this.viewData.avatar
                ? this.viewData.avatar
                : 'assets/svg/common/ic_no_avatar_driver.svg'
        );
    }
    changeChatBox(e: number) {
        this.driverService
            .getDriverById(e)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (x) => (this.selectedData = x),
                (err) => console.error(err)
            );

        //this.driverBox[indx].checked = e.target.checked;
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
