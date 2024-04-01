import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogSvgDefinitionsComponent } from './pages/catalog-svg-definitions/catalog-svg-definitions.component';

const routes: Routes = [
    {
        path: '',
        component: CatalogSvgDefinitionsComponent,
        data: { title: 'Catalog' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CatalogRoutingModule {}
