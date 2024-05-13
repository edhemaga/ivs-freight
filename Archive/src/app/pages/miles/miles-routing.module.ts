import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componets
import { MilesComponent } from '@pages/miles/pages/miles/miles.component';

const routes: Routes = [
    {
        path: '',
        component: MilesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MilesRoutingModule {}
