import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
import { AccidentModalComponent } from '../../safety/accident/accident-modal/accident-modal.component';
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { LoadModalComponent } from '../../modals/load-modal/load-modal.component';
import { ApplicantModalComponent } from '../../modals/applicant-modal/applicant-modal.component';
import { DriverMvrModalComponent } from '../../driver/driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '../../driver/driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../driver/driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';

@Component({
  selector: 'app-navigation-modals',
  templateUrl: './navigation-modals.component.html',
  styleUrls: ['./navigation-modals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationModalsComponent {
  @Input() isNavigationHoveredAndPanelOpen: boolean = false;

  public generalNavigationData: NavigationModal[] = generalNavigationData;
  public toolsNavigationData: NavigationModal[] = toolsNavigationData;
  public repairNavigationData: NavigationModal[] = repairNavigationData;
  public fuelNavigationData: NavigationModal[] = fuelNavigationData;
  public safetyNavigationData: NavigationModal[] = safetyNavigationData;
  public accountingNavigationData: NavigationModal[] = accountingNavigationData;

  public changeTextHoverOnCloseModal: boolean = false;

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {}

  public onAction(action: string, item?: NavigationModal) {
    switch (action) {
      case 'Close Panel': {
        this.navigationService.onDropdownActivation({
          name: 'Modal Panel',
          type: false,
        });
        break;
      }
      case 'Open Modal': {
        this.openModal(item);
        break;
      }
      default:
        return;
    }
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
        this.modalService.openModal(ContactModalComponent, { size: 'small' });
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
      case 'purchase': {
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
        this.modalService.openModal(DriverMvrModalComponent, { size: 'small' });
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
      default: {
        break;
      }
    }
  }

  public identity(index: number, item: NavigationModal): number {
    return item.id;
  }
}
