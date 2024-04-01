import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    moveElementsTopDownModal,
    smoothHeight,
} from '../navigation.animation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Models
import { NavigationModal } from '../../model/navigation.model';
import {
    accountingNavigationData,
    fuelNavigationData,
    generalNavigationData,
    repairNavigationData,
    safetyNavigationData,
    toolsNavigationData,
    requestNavigationData,
} from '../../model/navigation-data';
//Services
import { NavigationService } from '../../services/navigation.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

//Components
import { AccountModalComponent } from 'src/app/core/components/modals/account-modal/account-modal.component';
import { DriverModalComponent } from 'src/app/core/components/modals/driver-modal/driver-modal.component';
import { TruckModalComponent } from 'src/app/core/components/modals/truck-modal/truck-modal.component';
import { TrailerModalComponent } from 'src/app/core/components/modals/trailer-modal/trailer-modal.component';
import { ContactModalComponent } from 'src/app/core/components/modals/contact-modal/contact-modal.component';
import { BrokerModalComponent } from 'src/app/core/components/modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from 'src/app/core/components/modals/shipper-modal/shipper-modal.component';
import { OwnerModalComponent } from 'src/app/core/components/modals/owner-modal/owner-modal.component';
import { UserModalComponent } from 'src/app/core/components/modals/user-modal/user-modal.component';
import { TaskModalComponent } from 'src/app/core/components/modals/task-modal/task-modal.component';
import { FuelPurchaseModalComponent } from 'src/app/core/components/modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from 'src/app/core/components/modals/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { AccidentModalComponent } from 'src/app/core/components/modals/accident-modal/accident-modal.component';
import { RepairShopModalComponent } from 'src/app/core/components/modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from 'src/app/core/components/modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { LoadModalComponent } from 'src/app/core/components/modals/load-modal/components/load-modal/load-modal.component';
import { ApplicantModalComponent } from 'src/app/core/components/modals/applicant-modal/applicant-modal.component';
import { DriverMvrModalComponent } from 'src/app/core/components/modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from 'src/app/core/components/modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from 'src/app/core/components/modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { PayrollDeductionModalComponent } from 'src/app/core/components/modals/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { PayrollBonusModalComponent } from 'src/app/core/components/modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from 'src/app/core/components/modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';

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
                this.modalService.openModal(ContactModalComponent, {
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
                this.modalService.openModal(TaskModalComponent, {
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
