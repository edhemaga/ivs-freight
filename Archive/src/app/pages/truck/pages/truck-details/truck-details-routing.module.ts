import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { TruckDetailsComponent } from '@pages/truck/pages/truck-details//truck-details.component';

const routes: Routes = [
    {
        path: '',
        component: TruckDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TruckDetailsRoutingModule {}
