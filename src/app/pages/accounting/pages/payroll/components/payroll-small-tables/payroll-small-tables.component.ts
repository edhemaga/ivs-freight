import { Component, Input, OnInit } from '@angular/core';

// Components
import { PayrollCreditBonusComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';

// Services
import { ModalService } from 'src/app/shared/components/ta-modal/modal.service';

// Constants
import { PayrollSmallTableConfigConstants } from './utils/constants/payroll-small-tables-config.constants';
import { PayrollSmallTableConfigResizeConstants } from './utils/constants/payroll-small-tables-config-resize.constants';

@Component({
    selector: 'app-payroll-small-tables',
    templateUrl: './payroll-small-tables.component.html',
    styleUrls: ['./payroll-small-tables.component.scss'],
})
export class PayrollSmallTablesComponent implements OnInit {
    @Input() title: string;
    @Input() type: string;
    @Input() reportMainData: any;
    @Input() data: any[] = [];

    tableConfig: any = PayrollSmallTableConfigConstants;
    tableConfigResizable: any = PayrollSmallTableConfigResizeConstants;

    constructor(private modalService: ModalService) {}

    ngOnInit(): void {}

    public openAddNew() {
        const driverId = this.reportMainData.driver.id;

        switch (this.type) {
            case 'credit': {
                this.modalService.openModal(
                    PayrollCreditBonusComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                        data: {
                            id: null, // id for edit,
                            driverId: driverId, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
                        }, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
                    }
                );
                break;
            }
            case 'bonus': {
                this.modalService.openModal(
                    PayrollBonusModalComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                        data: {
                            id: null, // id for edit,
                            driverId: driverId, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
                        }, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
                    }
                );
                break;
            }
            case 'deduction': {
                this.modalService.openModal(
                    PayrollDeductionModalComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                        data: {
                            id: null, // id for edit,
                            driverId: driverId, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
                        }, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
                    }
                );
                break;
            }
            default: {
                this.modalService.openModal(
                    PayrollDeductionModalComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                        data: {
                            id: null, // id for edit,
                            driverId: driverId, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
                        }, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
                    }
                );
                break;
            }
        }
    }
}
