import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingMapComponent } from './routing-map/routing-map.component';

const routes: Routes = [
   {
      path: '',
      component: RoutingMapComponent,
      data: { title: 'Routing' },
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class RoutingRoutingModule {}
