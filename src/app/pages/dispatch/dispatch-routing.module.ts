import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchComponent } from './dispatch/dispatch.component';

const routes: Routes = [{
  path: "",
  component: DispatchComponent,
  data: {test: 1}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }