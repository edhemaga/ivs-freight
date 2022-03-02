import { Component, EventEmitter, Output } from '@angular/core';
import {
  generalNavigationData,
  toolsNavigationData,
  repairNavigationData,
  fuelNavigationData,
  safetyNavigationData,
  accountingNavigationData,
} from '../model/navigation-data';
import { NavigationModal } from '../model/navigation.model';
@Component({
  selector: 'app-navigation-modals',
  templateUrl: './navigation-modals.component.html',
  styleUrls: ['./navigation-modals.component.scss'],
})
export class NavigationModalsComponent {
  public generalNavigationData: NavigationModal[] = generalNavigationData;
  public toolsNavigationData: NavigationModal[] = toolsNavigationData;
  public repairNavigationData: NavigationModal[] = repairNavigationData;
  public fuelNavigationData: NavigationModal[] = fuelNavigationData;
  public safetyNavigationData: NavigationModal[] = safetyNavigationData;
  public accountingNavigationData: NavigationModal[] = accountingNavigationData;

  @Output() onModalPanelCloseEvent = new EventEmitter<boolean>();

  public onModalPanelClose() {
    this.onModalPanelCloseEvent.emit(false);
  }
}
