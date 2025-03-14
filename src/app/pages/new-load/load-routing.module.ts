import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Resolvers
import { NewLoadDetailsResolver } from '@pages/new-load/resolvers/new-load-details.resolver';

// resolvers
const routes: Routes = [
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/new-load/pages/new-load-details/new-load-details.component'
            ).then((m) => m.NewLoadDetailsComponent),
        resolve: {data: NewLoadDetailsResolver}

        },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewLoadRoutingModule {}
