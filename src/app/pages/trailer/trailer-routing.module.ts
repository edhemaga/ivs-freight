import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerItemResolver } from './resolvers/trailer.items.resolver';
import { TrailerMinimalResolver } from './resolvers/trailer-minimal.resolver';
import { TrailerTableComponent } from './pages/trailer-table/trailer-table.component';

const routes: Routes = [
    {
        path: '',
        component: TrailerTableComponent,
        data: { title: 'Trailer' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import('./pages/trailer-details/trailer-details.module').then(
                (m) => m.TrailerDetailsModule
            ),
        resolve: {
            trailer: TrailerItemResolver,
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
