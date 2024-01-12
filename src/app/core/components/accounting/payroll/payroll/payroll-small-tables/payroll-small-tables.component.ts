import { Component, Input, OnInit } from '@angular/core';
import { PayrollCreditBonusComponent } from '../../../../modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from '../../../../modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from '../../../../modals/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import {
    small_table_config,
    small_table_config_resize,
} from '../state/table-settings/small-tables-config';

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

    tableConfig: any = small_table_config;
    tableConfigResizable: any = small_table_config_resize;

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
