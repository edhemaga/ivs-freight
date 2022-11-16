import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PspAuthorizationComponent } from './psp-authorization.component';

const routes: Routes = [
   {
      path: '',
      component: PspAuthorizationComponent,
      data: { title: 'PSP Authorization' },
      children: [],
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class PspAuthorizationRoutingModule {}
