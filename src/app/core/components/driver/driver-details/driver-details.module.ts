import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';

@NgModule({
  declarations: [DriverDetailsComponent],
  imports: [CommonModule, DriverDetailsRoutes],
})
export class DriverDetailsModule {}
