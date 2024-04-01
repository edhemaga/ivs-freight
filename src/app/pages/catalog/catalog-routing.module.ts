import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SvgDefinitionsComponent } from './pages/svg-definitions/svg-definitions.component';

const routes: Routes = [
    {
        path: '',
        component: SvgDefinitionsComponent,
        data: { title: 'Catalog' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CatalogRoutingModule {}
