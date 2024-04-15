import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { TelematicMapComponent } from '@pages/telematic/pages/telematic-map/telematic-map.component';

const routes: Routes = [
    {
        path: '',
        component: TelematicMapComponent,
        data: { title: 'Telematic' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TelematicRoutingModule {}
