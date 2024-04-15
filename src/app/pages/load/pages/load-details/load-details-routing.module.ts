import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { LoadDetailsComponent } from '@pages/load/pages/load-details//load-details.component';

const routes: Routes = [
    {
        path: '',
        component: LoadDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoadDetailsRoutingModule {}
