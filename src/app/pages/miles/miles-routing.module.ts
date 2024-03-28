import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MilesComponent } from './miles/miles.component';

const routes: Routes = [
  {
    path: "",
    component: MilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilesRoutingModule { }
