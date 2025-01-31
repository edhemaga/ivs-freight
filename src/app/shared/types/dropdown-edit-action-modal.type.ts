import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';

export type DropdownEditActionModal =
    | ContactsModalComponent
    | AccountModalComponent
    | OwnerModalComponent
    | RepairOrderModalComponent
    | RepairShopModalComponent
    | UserModalComponent
    | FuelPurchaseModalComponent
    | FuelStopModalComponent
    | TruckModalComponent
    | TrailerModalComponent
    | DriverModalComponent;
