import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { ShipperDetailsComponent } from '@pages/customer/pages/shipper-details/shipper-details.component';

const routes: Routes = [
    {
        path: '',
        component: ShipperDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShipperDetailsRoutingModule {}
