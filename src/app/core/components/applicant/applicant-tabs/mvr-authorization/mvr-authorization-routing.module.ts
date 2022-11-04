import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MvrAuthorizationComponent } from './mvr-authorization.component';

const routes: Routes = [
  {
    path: '',
    component: MvrAuthorizationComponent,
    data: { title: 'MVR Authorization' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MvrAuthorizationRoutingModule {}
