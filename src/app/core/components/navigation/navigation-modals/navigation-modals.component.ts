import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import {
    accountingNavigationData,
    fuelNavigationData,
    generalNavigationData,
    repairNavigationData,
    safetyNavigationData,
    toolsNavigationData,
} from '../model/navigation-data';
import { NavigationModal } from '../model/navigation.model';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ContactModalComponent } from '../../modals/contact-modal/contact-modal.component';
import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../modals/shipper-modal/shipper-modal.component';
import { OwnerModalComponent } from '../../modals/owner-modal/owner-modal.component';
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { TaskModalComponent } from '../../modals/task-modal/task-modal.component';
import { FuelPurchaseModalComponent } from '../../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '../../modals/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { AccidentModalComponent } from '../../modals/accident-modal/accident-modal.component';
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { LoadModalComponent } from '../../modals/load-modal/load-modal.component';
import { ApplicantModalComponent } from '../../modals/applicant-modal/applicant-modal.component';
import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { PayrollDeductionModalComponent } from '../../modals/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { PayrollBonusModalComponent } from '../../modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from '../../modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import {
    moveElementsTopDownModal,
    smoothHeight,
} from '../navigation.animation';

@Component({
    selector: 'app-navigation-modals',
    templateUrl: './navigation-modals.component.html',
    styleUrls: ['./navigation-modals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        smoothHeight('showHideDetails'),
        moveElementsTopDownModal('moveTopDown'),
    ],
})
export class NavigationModalsComponent {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;
    @Input() isNavigationHovered: boolean = false;
    @Output() ChangeCloseText = new EventEmitter<Boolean>();
    public generalNavigationData: NavigationModal[] = generalNavigationData;
    public toolsNavigationData: NavigationModal[] = toolsNavigationData;
    public repairNavigationData: NavigationModal[] = repairNavigationData;
    public fuelNavigationData: NavigationModal[] = fuelNavigationData;
    public safetyNavigationData: NavigationModal[] = safetyNavigationData;
    public accountingNavigationData: NavigationModal[] =
        accountingNavigationData;

    public changeTextHoverOnCloseModal: boolean = false;
    public Title: string = 'Add New';
    public OpenCloseModal: boolean = false;
    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService
    ) {}
    public OpenMainModal(openClose: boolean) {
        this.OpenCloseModal = openClose;
        this.navigationService.onDropdownActivation({
            name: 'Modal Panel',
            type: this.OpenCloseModal,
        });
    }
    public changeText(text: boolean) {
        this.ChangeCloseText.emit(text);
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
