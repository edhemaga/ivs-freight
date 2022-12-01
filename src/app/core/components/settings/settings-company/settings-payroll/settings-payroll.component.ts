import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';

@Component({
    selector: 'app-settings-payroll',
    templateUrl: './settings-payroll.component.html',
    styleUrls: ['./settings-payroll.component.scss'],
})
export class SettingsPayrollComponent implements OnChanges {
    @Input() public payrollData: any;
    companyDivision: boolean = false;
    constructor(private settingsCompanyService: SettingsCompanyService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes?.payrollData?.currentValue !==
            changes?.payrollData?.previousValue
        ) {
            this.payrollData = changes?.payrollData?.currentValue;
        }   
        
        if (changes?.payrollData?.currentValue?.divisions?.length < 1) {
            this.companyDivision = true;
        } else {
            this.companyDivision = false;
        }
    }

    public identity(index: number, item: any): number {
        return item.id;
    }
    public onAction(modal: { modalName: string; type: string; company?: any }) {
        this.settingsCompanyService.onModalAction(modal);
    }

    public setNameFormat(mod){
        
        if ( mod == 'Driver&Owner' ) {
            mod = 'Driver & Owner';
            return mod;
        } else {
            return mod.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
        }
        
    }
}
