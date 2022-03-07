import {Component, EventEmitter, Output} from '@angular/core';
import {CustomModalService} from 'src/app/core/services/modals/custom-modal.service';
import {DriverManageComponent} from '../../modals/driver-manage/driver-manage.component';
import {
  accountingNavigationData,
  fuelNavigationData,
  generalNavigationData,
  repairNavigationData,
  safetyNavigationData,
  toolsNavigationData,
} from '../model/navigation-data';
import {NavigationModal} from '../model/navigation.model';
import {TruckManageComponent} from "../../modals/truck-manage/truck-manage.component";
import {TrailerManageComponent} from "../../modals/trailer-manage/trailer-manage.component";

@Component({
  selector: 'app-navigation-modals',
  templateUrl: './navigation-modals.component.html',
  styleUrls: ['./navigation-modals.component.scss'],
})
export class NavigationModalsComponent {
  @Output() onModalPanelCloseEvent = new EventEmitter<{ type: boolean, name: string }>();

  public generalNavigationData: NavigationModal[] = generalNavigationData;
  public toolsNavigationData: NavigationModal[] = toolsNavigationData;
  public repairNavigationData: NavigationModal[] = repairNavigationData;
  public fuelNavigationData: NavigationModal[] = fuelNavigationData;
  public safetyNavigationData: NavigationModal[] = safetyNavigationData;
  public accountingNavigationData: NavigationModal[] = accountingNavigationData;

  public changeTextHoverOnCloseModal: boolean = false;

  constructor(private customModalService: CustomModalService) {
  }

  public onAction(action: string, item?: NavigationModal) {
    switch (action) {
      case 'Close Panel': {
        this.onModalPanelCloseEvent.emit({type: false, name: 'Modal Panel'});
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
    const path = navItem.path;
    const data = {
      type: 'new',
      vehicle: 'truck',
    };
    switch (path) {
      case 'driver':
        this.customModalService.openModal(
          DriverManageComponent,
          {data},
          null,
          {size: 'small'}
        );
        break;

      case 'truck':
        this.customModalService.openModal(TruckManageComponent, {data}, null, {size: 'small'});
        break;

      case 'trailer':
        this.customModalService.openModal(TrailerManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      /*
    case 'fuel':
      this.customModalService.openModal(FuelManageComponent, {data}, null, {size: 'small'});
      break;

    case 'shop':
      this.customModalService.openModal(RepairShopManageComponent, {data}, null, {
        size: 'small',
      });
      break;



    case 'load':
      this.customModalService.openModal(ManageLoadComponent, {data}, null, {
        size: 'xxl',
      });
      break;

    case 'repair':
      this.customModalService.openModal(MaintenanceManageComponent, {data}, null, {
        size: 'large',
      });
      break;

    case 'owner':
      this.customModalService.openModal(OwnerManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'user':
      this.customModalService.openModal(CompanyUserManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'account':
      this.customModalService.openModal(AccountsManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'contact':
      this.customModalService.openModal(ContactManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'task':
      this.customModalService.openModal(TodoManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'broker':
      this.customModalService.openModal(CustomerManageComponent, {data}, null, {
        size: 'small',
      });
      break;

    case 'shipper':
      this.customModalService.openModal(ShipperManageComponent, {data}, null, {
        size: 'small',
      });
      break; */

      default:
        return;
    }
  }
}
