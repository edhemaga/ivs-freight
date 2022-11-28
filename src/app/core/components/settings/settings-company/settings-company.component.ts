import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { CompanyQuery } from '../state/company-state/company-settings.query';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';

@Component({
    selector: 'app-settings-company',
    templateUrl: './settings-company.component.html',
    styleUrls: ['./settings-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DetailsPageService],
})
export class SettingsCompanyComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public isModalOpen$: boolean;
    // public isModalOpen$: boolean; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
    public data: any;
    public dataDivison: any;
    public optionsCmp: any;
    public dataCompany: any;

    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private activated: ActivatedRoute,
        private detailsPageSer: DetailsPageService,
        private notificationService: NotificationService,
        private cdRef: ChangeDetectorRef,
        private tableService: TruckassistTableService,
        private settingCompanyQuery: CompanyQuery
    ) {}

    ngOnInit(): void {
        this.selectCompanyFunction();
        this.getCompanyDivision();
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.dataCompany = res.data.divisions;
                    this.data = res.data;
                    this.getCompanyDivision();
                    this.cdRef.detectChanges();
                }
            });
        this.getData(this.activated.snapshot.data.company);

        this.detailsPageSer.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                this.settingsCompanyService
                    .getCompanyDivisionById(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res: CompanyResponse) => {
                            this.getData(res);
                            
                            this.cdRef.detectChanges();
                        },
                        error: () => {
                            this.getData(this.activated.snapshot.data.company);
                           
                        },
                    });
            });
    }

    public getData(data: CompanyResponse) {
        this.data = data;
    }
    public selectCompanyFunction() {
        return this.settingCompanyQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) =>
                item.map((company) => {
                    this.dataCompany = company.divisions;
                    if (company?.companyPayrolls?.length) {
                        this.isModalOpen$ = false;
                    } else {
                        this.isModalOpen$ = true;
                    }
                })
            );
    }
    public getCompanyDivision() {
        this.optionsCmp = this.dataCompany?.map((item) => {
            return {
                ...item,
                id: item.id,
                name: item.companyName,
                active: !item.isDivision,
            };
        });
    }
    public selectCompany(event: any) {
        this.optionsCmp = this.dataCompany.map((item) => {
            return {
                ...item,
                id: item.id,
                name: item.companyName,
                active: item.id === event.id,
            };
        });
        this.detailsPageSer.getDataDetailId(event.id);
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
