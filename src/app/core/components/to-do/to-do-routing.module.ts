import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToDoListCardComponent } from './to-do-list-card/to-do-list-card.component';

const routes: Routes = [
   {
      path: '',
      component: ToDoListCardComponent,
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class ToDoRoutingModule {}
