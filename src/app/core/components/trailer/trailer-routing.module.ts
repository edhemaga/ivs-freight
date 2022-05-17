import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerTableComponent } from './trailer-table/trailer-table.component';

const routes: Routes = [
  {
    path: '',
    component: TrailerTableComponent,
    data: { title: 'Trailer' },
  },
  {
    path:':id/details',
    loadChildren:()=>
    import('./trailer-details/trailer-details.module').then(
      (m) => m.TrailerDetailsModule
    ),
    data:{title:'Trailer details'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TrailerRoutingModule {}
