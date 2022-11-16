import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverMinimalResolver } from './state/driver-details-minimal-list-state/driver-minimal-list.resolver';
import { DriverItemResolver } from './state/driver-details-state/driver.items.resolver';

const routes: Routes = [
   {
      path: '',
      component: DriverTableComponent,
      data: { title: 'Driver' },
   },
   {
      path: ':id/details',
      loadChildren: () =>
         import('./driver-details/driver-details.module').then(
            (m) => m.DriverDetailsModule
         ),
      resolve: {
         driver: DriverItemResolver,
         driverMinimal: DriverMinimalResolver,
      },
      data: { title: 'Driver Details' },
   },
   {
      path: 'card',
      component: DriverCardComponent,
      data: { title: 'Driver Cards' },
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class DriverRoutingModule {}
