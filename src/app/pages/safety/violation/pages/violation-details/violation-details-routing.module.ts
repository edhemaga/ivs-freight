import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { ViolationDetailsComponent } from '@pages/safety/violation/pages/violation-details/violation-details.component';

const routes: Routes = [
    {
        path: '',
        component: ViolationDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViolationDetailsRoutingModule {}
