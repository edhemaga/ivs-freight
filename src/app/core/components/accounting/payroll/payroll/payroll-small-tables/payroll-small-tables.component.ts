import { Component, Input, OnInit } from '@angular/core';
import { PayrollBonusModalComponent } from 'src/app/core/components/modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from 'src/app/core/components/modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollDeducationModalComponent } from 'src/app/core/components/modals/payroll-modals/payroll-deducation-modal/payroll-deducation-modal.component';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

@Component({
    selector: 'app-payroll-small-tables',
    templateUrl: './payroll-small-tables.component.html',
    styleUrls: ['./payroll-small-tables.component.scss'],
})
export class PayrollSmallTablesComponent implements OnInit {
    @Input() title: string;
    @Input() type: string;
    @Input() reportMainData: any;
    constructor(private modalService: ModalService) {}

    ngOnInit(): void {}

    public openAddNew() {
        switch (this.type) {
            case 'credit': {
                console.log(this.reportMainData);

                console.log(this.reportMainData.owner.id);
                this.modalService.openModal(PayrollCreditBonusComponent, {
                    size: 'small',
                });
                break;
            }
            case 'bonus': {
                this.modalService.openModal(PayrollBonusModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'deduction': {
                this.modalService.openModal(PayrollDeducationModalComponent, {
                    size: 'small',
                });
                break;
            }
            default: {
                this.modalService.openModal(PayrollDeducationModalComponent, {
                    size: 'small',
                });
                break;
            }
        }
    }
}
