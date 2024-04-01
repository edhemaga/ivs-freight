import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerCardComponent } from './pages/owner-card/owner-card.component';
import { OwnerTableComponent } from './pages/owner-table/owner-table.component';

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
