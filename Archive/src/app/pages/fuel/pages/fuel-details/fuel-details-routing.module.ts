import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { FuelDetailsComponent } from '@pages/fuel/pages/fuel-details/fuel-details.component';

const routes: Routes = [
    {
        path: '',
        component: FuelDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FuelDetailsRoutingModule {}
