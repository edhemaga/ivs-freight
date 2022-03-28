import { Navigation } from './../model/navigation.model';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { DriverManageComponent } from '../../modals/driver-manage/driver-manage.component';
import { TrailerManageComponent } from '../../modals/trailer-manage/trailer-manage.component';
import { TruckManageComponent } from '../../modals/truck-manage/truck-manage.component';

import {
  accountingNavigationData,
  fuelNavigationData,
  generalNavigationData,
  repairNavigationData,
  safetyNavigationData,
  toolsNavigationData,
} from '../model/navigation-data';
import { NavigationModal } from '../model/navigation.model';
import { BrokerManageComponent } from '../../modals/broker-manage/broker-manage.component';
import { FuelManageComponent } from '../../modals/fuel-manage/fuel-manage.component';
import { ShipperManageComponent } from '../../modals/shipper-manage/shipper-manage.component';
import { RepairShopManageComponent } from '../../modals/repair-shop-manage/repair-shop-manage.component';
import { MaintenanceManageComponent } from '../../modals/maintenance-manage/maintenance-manage.component';
import { CompanyUserManageComponent } from '../../modals/company-user-manage/company-user-manage.component';
import { ContactManageComponent } from '../../modals/contact-manage/contact-manage.component';
import { AccountManageComponent } from '../../modals/account-manage/account-manage.component';
import { OwnerManageComponent } from '../../modals/owner-manage/owner-manage.component';
import { TodoManageComponent } from '../../modals/todo-manage/todo-manage.component';
import { NavigationService } from '../services/navigation.service';

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
    private customModalService: CustomModalService,
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
    const path = navItem.path;
    const data = {
      type: 'new',
      vehicle: 'truck',
    };
    switch (path) {
      case 'driver':
        this.customModalService.openModal(
          DriverManageComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;

      case 'truck':
        this.customModalService.openModal(
          TruckManageComponent,
          { data },
          null,
          { size: 'small' }
        );
        break;

      case 'trailer':
        this.customModalService.openModal(
          TrailerManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'broker':
        this.customModalService.openModal(
          BrokerManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'fuel':
        this.customModalService.openModal(FuelManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'shipper':
        this.customModalService.openModal(
          ShipperManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'shop':
        this.customModalService.openModal(
          RepairShopManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'repair':
        this.customModalService.openModal(
          MaintenanceManageComponent,
          { data },
          null,
          {
            size: 'large',
          }
        );
        break;

      case 'user':
        this.customModalService.openModal(
          CompanyUserManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'contact':
        this.customModalService.openModal(
          ContactManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'account':
        this.customModalService.openModal(
          AccountManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'owner':
        this.customModalService.openModal(
          OwnerManageComponent,
          { data },
          null,
          {
            size: 'small',
          }
        );
        break;

      case 'task':
        this.customModalService.openModal(TodoManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      // case 'load':
      //   this.customModalService.openModal(ManageLoadComponent, { data }, null, {
      //     size: 'xxl',
      //   });
      //   break;

      default:
        return;
    }
  }

  public identity(index: number, item: NavigationModal): number {
    return item.id;
  }
}
