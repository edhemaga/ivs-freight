import { Component, Input, OnInit } from '@angular/core';
import { PayrollCreditBonusComponent } from '../../../../modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from '../../../../modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from '../../../../modals/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { ModalService } from '../../../../shared/ta-modal/modal.service';

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
        console.log('type: ', this.type);
        switch (this.type) {
            case 'credit': {
                console.log(this.reportMainData);

                // console.log(this.reportMainData.owner.id);
                this.modalService.openModal(
                    PayrollCreditBonusComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new', // 'edit' stavljas ako treba kad se azurira postojeci
                        data: {
                            id: null, // id for edit,
                            driverId: 5, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
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
                            driverId: 5, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
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
                            driverId: 5, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
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
                            driverId: 4, // TODO: a moze iz store-a da izvuces i da mi prosledis sve podatke o vozacu
                        }, // da ne bi morao da pozivam kod sebe get by id, samo javi kad zavrsis
                    }
                );
                break;
            }
        }
    }
}
