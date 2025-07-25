import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { TrailerItemsResolver } from '@pages/trailer/resolvers/trailer-items.resolver';
import { TrailerMinimalResolver } from '@pages/trailer/resolvers/trailer-minimal.resolver';

// components
import { TrailerTableComponent } from '@pages/trailer/pages/trailer-table/trailer-table.component';

const routes: Routes = [
    {
        path: '',
        component: TrailerTableComponent,
        data: { title: 'Trailer' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import(
                '@pages/trailer/pages/trailer-details/trailer-details.module'
            ).then((m) => m.TrailerDetailsModule),
        resolve: {
            trailer: TrailerItemsResolver,
            trailerMinimal: TrailerMinimalResolver,
        },
        data: { title: 'Trailer detail' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrailerRoutingModule {}
