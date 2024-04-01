import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { PayrollStoreService } from '../../../../services/payroll.service';
import { commision_driver_open_loads } from '../../../../utils/constants/commision_driver_open_loads.constants';
import {
    owner_open_loads,
    owner_open_loads_resizable,
} from '../../../../utils/constants/owner_open_load.constants';
import * as AppConst from 'src/app/const';
import { UntypedFormControl } from '@angular/forms';
import {
    miles_driver_open_loads,
    miles_driver_open_loads_resizable,
} from '../../../../utils/constants/miles_driver_open_loads.constants';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit {
    reportMainData: any = { loads: [], truck: {}, owner: {}, driver: {} };
    tableSettings: any[] = [];
    tableSettingsResizable: any[] = [];
    title: string = '';

    public payAmount: UntypedFormControl = new UntypedFormControl();

    mapLatitude: number = 41.860119;
    mapLongitude: number = -87.660156;
    mapZoom: number = 1;

    agmMap: any;
    styles = AppConst.GOOGLE_MAP_STYLES;
    mapRestrictions = {
        latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
        strictBounds: true,
    };

    @Input() set reportTableData(value) {
        if (value.id) {
            this.getDataBasedOnTitle(value);
        }
    }

    constructor(
        private ps: PayrollStoreService,
        private dch: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    getDataBasedOnTitle(data: { id: number; title: string }) {
        this.title = data.title;
        switch (data.title) {
            case 'Owner':
                this.tableSettings = owner_open_loads;
                this.tableSettingsResizable = owner_open_loads_resizable;
                // They changed back in service is same error it need to be checked further to resolve error
                // this.ps.getPayrollOwnerOpenReport(data.id).subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
            case 'Driver (Commission)':
                this.tableSettings = commision_driver_open_loads;
                this.ps
                    .getPayrollCommisionDriverOpenReport(data.id)
                    .subscribe((res) => {
                        this.reportMainData = res;
                        this.dch.detectChanges();
                    });
                break;
            case 'Driver (Miles)':
                this.tableSettings = miles_driver_open_loads;
                this.tableSettingsResizable = miles_driver_open_loads_resizable;
                this.ps.getPayrollMileageDriverOpenReport(data.id);
                // Same error as above
                // .subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
        }
    }
}
