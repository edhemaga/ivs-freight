import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Resolvers
import { NewLoadDetailsResolver } from '@pages/new-load/resolvers/new-load-details.resolver';
import { LoadResolver } from '@pages/load/resolvers/load.resolver';

// resolvers
const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/new-load/new-load.component').then(
                (c) => c.NewLoadComponent
            ),
        resolve: { data: LoadResolver },
    },
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/new-load/pages/new-load-details/new-load-details.component'
            ).then((c) => c.NewLoadDetailsComponent),
        resolve: { data: NewLoadDetailsResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewLoadRoutingModule {}
