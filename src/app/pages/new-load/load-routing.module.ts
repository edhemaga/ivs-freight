import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { loadDetailsResolver } from '@pages/new-load/resolvers/load-details.resolver';
import { LoadResolver } from '@pages/new-load/resolvers/load.resolver';

// enums
import { eLoadRouting } from '@pages/new-load/enums';
import { eStringPlaceholder } from 'ca-components';

// resolvers
const routes: Routes = [
    {
        path: eStringPlaceholder.EMPTY,
        data: { title: 'New Load' },
        loadComponent: () =>
            import('@pages/new-load/new-load.component').then(
                (c) => c.NewLoadComponent
            ),
        resolve: { data: LoadResolver },
    },
    {
        path: `:id/${eLoadRouting.DETAILS}`,
        data: { title: 'New Load Details' },
        loadComponent: () =>
            import(
                '@pages/new-load/pages/new-load-details/new-load-details.component'
            ).then((c) => c.NewLoadDetailsComponent),
        // resolve: { data: loadDetailsResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewLoadRoutingModule {}
