import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsGeneralComponent } from './driver-details-general/driver-details-general.component';
import { DriverDetailsCdlComponent } from './driver-details-cdl/driver-details-cdl.component';
import { DriverDetailsDrugAlcoholComponent } from './driver-details-drugAlcohol/driver-details-drugAlcohol.component';
import { DriverDetailsMedicalComponent } from './driver-details-medical/driver-details-medical.component';
import { DriverDetailsMvrComponent } from './driver-details-mvr/driver-details-mvr.component';

@NgModule({
  declarations: [
    DriverDetailsComponent,
    DriverDetailsGeneralComponent,
    DriverDetailsCdlComponent,
    DriverDetailsDrugAlcoholComponent,
    DriverDetailsMedicalComponent,
    DriverDetailsMvrComponent
  ],
  imports: [CommonModule, DriverDetailsRoutes],
})
export class DriverDetailsModule {}
