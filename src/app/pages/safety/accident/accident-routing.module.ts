import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { AccidentTableComponent } from './pages/accident-table/accident-table.component';

const routes: Routes = [
    {
        path: '',
        component: AccidentTableComponent,
        data: { title: 'Accident' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccidentRoutingModule {}
