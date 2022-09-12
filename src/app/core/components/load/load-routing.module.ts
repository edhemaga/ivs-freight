import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadCardComponent } from './load-card/load-card.component';
import { LoadTableComponent } from './load-table/load-table.component';
import { LoadDetailsModule } from './load-details/load-details.module';
import { LoatItemResolver } from './state/load-details-state/load-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: LoadTableComponent,
    data: { title: 'Load' },
  },
  {
    path: ':id/details',
    loadChildren: () =>
      import('./load-details/load-details.module').then(
        (m) => m.LoadDetailsModule
      ),
    resolve: {
      loadItem: LoatItemResolver,
    },
    data: { title: 'Load Details' },
  },
  {
    path: 'card',
    component: LoadCardComponent,
    data: { title: 'Load detail' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadRoutingModule {}
