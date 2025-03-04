import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    moveElementsTopDownModal,
    smoothHeight,
} from '@core/components/navigation/animations/navigation.animation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// models
import { NavigationModal } from '@core/components/navigation/models';
// constants
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';
import { ModalService } from '@shared/services/modal.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { ContactStoreService } from '@pages/contacts/services/contact-store.service';

// components
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { TodoModalComponent } from '@pages/to-do/pages/to-do-modal/to-do-modal.component';
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { AccidentModalComponent } from '@pages/safety/accident/pages/accident-modal/accident-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { ApplicantModalComponent } from '@pages/applicant/pages/applicant-modal/applicant-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { PayrollDeductionModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { PayrollBonusModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-navigation-modals',
    templateUrl: './navigation-modals.component.html',
    styleUrls: ['./navigation-modals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbModule,
        TaAppTooltipV2Component,
    ],
    animations: [
        smoothHeight('showHideDetails'),
        moveElementsTopDownModal('moveTopDown'),
    ],
})
export class NavigationModalsComponent {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;
    @Input() isNavigationHovered: boolean = false;
    @Input() isModalPanelOpen: boolean;
    public generalNavigationData: NavigationModal[] =
        NavigationDataConstants.generalNavigationData;
    public toolsNavigationData: NavigationModal[] =
        NavigationDataConstants.toolsNavigationData;
    public repairNavigationData: NavigationModal[] =
        NavigationDataConstants.repairNavigationData;
    public fuelNavigationData: NavigationModal[] =
        NavigationDataConstants.fuelNavigationData;
    public safetyNavigationData: NavigationModal[] =
        NavigationDataConstants.safetyNavigationData;
    public requestNavigationData: NavigationModal[] =
        NavigationDataConstants.requestNavigationData;
    public accountingNavigationData: NavigationModal[] =
        NavigationDataConstants.accountingNavigationData;

    public addNew = NavigationDataConstants.title;

    public title: string = this.addNew;

    public icons = NavigationDataConstants.icons;

    public navigationDataConstants = NavigationDataConstants;
    private isExpandButtonHovered: boolean = false;

    constructor(
        private modalService: ModalService,
        private navigationService: NavigationService,
        private loadStoreService: LoadStoreService,
        private contactStoreService: ContactStoreService

    ) {}

    public OpenMainModal(openClose: boolean): void {
        this.navigationService.onDropdownActivation({
            name: 'Modal Panel',
            type: openClose,
        });
        this.title =
            openClose && this.isExpandButtonHovered
                ? NavigationDataConstants.close
                : NavigationDataConstants.title;
    }

    public changeText(text: string, expandBUttonHovered: boolean): void {
        this.isExpandButtonHovered = expandBUttonHovered;
        this.title = this.isModalPanelOpen
            ? text
            : NavigationDataConstants.title;
    }

    public onAction(item: NavigationModal): void {
        this.openModal(item);
    }

    private openModal(navItem: NavigationModal): void {
        switch (navItem.path) {
            case 'load': {
                this.loadStoreService.dispatchGetCreateLoadModalData();
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
                this.contactStoreService.dispatchGetCreateContactModalData()
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
            case 'transaction':
            case 'fuel': {
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
                this.modalService.openModal(
                    DriverDrugAlcoholTestModalComponent,
                    {
                        size: 'small',
                    }
                );
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
}
