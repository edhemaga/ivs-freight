import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerCardComponent } from './owner-card/owner-card.component';
import { OwnerTableComponent } from './owner-table/owner-table.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerTableComponent,
    data: { title: 'Owner' },
  },
  {
    path: 'card',
    component: OwnerCardComponent,
    data: { title: 'Load detail' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
