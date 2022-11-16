import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoadItemResolver } from './state/roadside-details-state/roadside-details.resolver';
import { RoadsideMinimalResolver } from './state/roadside-details-state/roadside-minimal-list-state/roadside-minimal.resolver';
import { ViolationTableComponent } from './violation-table/violation-table.component';

const routes: Routes = [
   {
      path: '',
      component: ViolationTableComponent,
      data: { title: 'Violation' },
   },
   {
      path: ':id/details',
      loadChildren: () =>
         import('./violation-details-page/violation-details.module').then(
            (m) => m.ViolationDetailsModule
         ),
      resolve: {
         roadItem: RoadItemResolver,
         roadMinimal: RoadsideMinimalResolver,
      },
      data: { title: 'Violation Details' },
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class ViolationRoutingModule {}
