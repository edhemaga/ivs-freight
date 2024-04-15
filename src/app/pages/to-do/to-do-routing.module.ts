import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { ToDoListCardComponent } from '@pages/to-do/pages/to-do-list-card/to-do-list-card.component';

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
