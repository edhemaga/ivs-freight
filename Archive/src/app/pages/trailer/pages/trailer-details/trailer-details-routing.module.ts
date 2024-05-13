import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { TrailerDetailsComponent } from '@pages/trailer/pages/trailer-details/trailer-details.component';

const routes: Routes = [
    {
        path: '',
        component: TrailerDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrailerDetailsRoutingModule {}
