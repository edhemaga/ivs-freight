import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    moveElementsTopDownModal,
    smoothHeight,
} from '../../animations/navigation.animation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Models
import { NavigationModal } from '../../models/navigation.model';
import {
    accountingNavigationData,
    fuelNavigationData,
    generalNavigationData,
    repairNavigationData,
    safetyNavigationData,
    toolsNavigationData,
    requestNavigationData,
} from '../../utils/constants/navigation-data.constants';
//Services
import { NavigationService } from '../../services/navigation.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';

//Components

import { DriverModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { AccountModalComponent } from 'src/app/pages/account/pages/account-modal/account-modal.component';
import { TruckModalComponent } from 'src/app/pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from 'src/app/pages/trailer/pages/trailer-modal/trailer-modal.component';
import { ContactsModalComponent } from 'src/app/pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from 'src/app/pages/owner/pages/owner-modal/owner-modal.component';
import { TodoModalComponent } from 'src/app/pages/to-do/pages/to-do-modal/to-do-modal.component';
import { FuelPurchaseModalComponent } from 'src/app/pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from 'src/app/pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { BrokerModalComponent } from 'src/app/pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from 'src/app/pages/customer/pages/shipper-modal/shipper-modal.component';
import { UserModalComponent } from 'src/app/pages/user/pages/user-modal/user-modal.component';
import { AccidentModalComponent } from 'src/app/pages/safety/accident/pages/accident-modal/accident-modal.component';
import { RepairShopModalComponent } from 'src/app/pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from 'src/app/pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { ApplicantModalComponent } from 'src/app/core/components/modals/applicant-modal/applicant-modal.component';
import { DriverMvrModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { PayrollDeductionModalComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { PayrollBonusModalComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from 'src/app/pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { LoadModalComponent } from 'src/app/pages/load/pages/load-modal/load-modal.component';

@Component({
    selector: 'app-navigation-modals',
    templateUrl: './navigation-modals.component.html',
    styleUrls: ['./navigation-modals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
    animations: [
        smoothHeight('showHideDetails'),
        moveElementsTopDownModal('moveTopDown'),
    ],
})
export class NavigationModalsComponent {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;
    @Input() isNavigationHovered: boolean = false;
    @Input() isModalPanelOpen: boolean;
    public generalNavigationData: NavigationModal[] = generalNavigationData;
    public toolsNavigationData: NavigationModal[] = toolsNavigationData;
    public repairNavigationData: NavigationModal[] = repairNavigationData;
    public fuelNavigationData: NavigationModal[] = fuelNavigationData;
    public safetyNavigationData: NavigationModal[] = safetyNavigationData;
    public requestNavigationData: NavigationModal[] = requestNavigationData;
    public accountingNavigationData: NavigationModal[] =
        accountingNavigationData;
    public showToolTip: boolean = false;
    public changeTextHoverOnCloseModal: boolean = false;
    public Title: string = 'Add Anything';
    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService
    ) {}
    public OpenMainModal(openClose: boolean) {
        this.navigationService.onDropdownActivation({
            name: 'Modal Panel',
            type: openClose,
        });
    }
    public changeText(text: boolean) {
        text == true && text
            ? (this.Title = 'Close')
            : (this.Title = 'Add Anything');
    }
    public onAction(item: NavigationModal) {
        this.openModal(item);
    }

    private openModal(navItem: NavigationModal) {
        switch (navItem.path) {
            case 'load': {
                this.modalService.openModal(LoadModalComponent, {
                    size: 'load',
                });
                break;
            }
            case 'driver': {
                this.modalService.openModal(DriverModalComponent, {
                    size: 'medium',
                });
                break;
            }
            case 'truck': {
                this.modalService.openModal(TruckModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'trailer': {
                this.modalService.openModal(TrailerModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'broker': {
                this.modalService.openModal(BrokerModalComponent, {
                    size: 'medium',
                });
                break;
            }
            case 'shipper': {
                this.modalService.openModal(ShipperModalComponent, {
                    size: 'medium',
                });
                break;
            }
            case 'owner': {
                this.modalService.openModal(OwnerModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'user': {
                this.modalService.openModal(UserModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'contact': {
                this.modalService.openModal(ContactsModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'account': {
                this.modalService.openModal(AccountModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'applicant': {
                this.modalService.openModal(ApplicantModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'repair-order': {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: 'large',
                    },
                    { type: 'new-truck' }
                );
                break;
            }
            case 'repair-shop': {
                this.modalService.openModal(RepairShopModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'task': {
                this.modalService.openModal(TodoModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'transaction': {
                this.modalService.openModal(FuelPurchaseModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'fuel-stop': {
                this.modalService.openModal(FuelStopModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'accident': {
                this.modalService.openModal(AccidentModalComponent, {
                    size: 'large-xl',
                });
                break;
            }
            case 'mvr': {
                this.modalService.openModal(DriverMvrModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'test': {
                this.modalService.openModal(DriverDrugAlcoholModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'medical': {
                this.modalService.openModal(DriverMedicalModalComponent, {
                    size: 'small',
                });
                break;
            }
            case 'credit': {
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
                this.modalService.openModal(PayrollDeductionModalComponent, {
                    size: 'small',
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public identity(index: number, item: NavigationModal): number {
        return item.id;
    }
}
