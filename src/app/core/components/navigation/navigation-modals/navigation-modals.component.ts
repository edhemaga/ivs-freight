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
    const path = navItem.path;
    switch (path) {
      case 'account': {
        this.modalService.openModal(AccountModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'driver': {
        this.modalService.openModal(DriverModalComponent, {
          size: 'small',
        });
        break;
      }
    }
  }

  public identity(index: number, item: NavigationModal): number {
    return item.id;
  }
}
