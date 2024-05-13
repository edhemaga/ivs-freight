import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { RepairShopDetailsComponent } from '@pages/repair/pages/repair-shop-details/repair-shop-details.component';

const routes: Routes = [
    {
        path: '',
        component: RepairShopDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RepairShopDetailsRoutingModule {}
