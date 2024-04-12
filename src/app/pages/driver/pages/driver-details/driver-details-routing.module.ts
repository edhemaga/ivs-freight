import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { DriverDetailsComponent } from '@pages/driver/pages/driver-details/driver-details.component';

const routes: Routes = [
    {
        path: '',
        component: DriverDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverDetailsRoutingModule {}
