import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadCardComponent } from './load-card/load-card.component';
import { LoadTableComponent } from './load-table/load-table.component';

const routes: Routes = [
  {
    path: '',
    component: LoadTableComponent,
    data: { title: 'Load' }
  },
  {
    path: 'card',
    component: LoadCardComponent,
    data: {title: 'Load detail'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class LoadRoutingModule {}
