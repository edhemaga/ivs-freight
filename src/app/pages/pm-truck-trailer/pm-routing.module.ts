import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmTableComponent } from './pages/pm-table/pm-table.component';

const routes: Routes = [
    {
        path: '',
        component: PmTableComponent,
        data: { title: 'PM' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PMRoutingModule {}
