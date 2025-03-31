import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';

export type DropdownDriverAddAdditionalActionModal =
    | DriverCdlModalComponent
    | DriverDrugAlcoholTestModalComponent
    | DriverMedicalModalComponent
    | DriverMvrModalComponent;
