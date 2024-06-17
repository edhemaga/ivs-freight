import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { LoadDetailsResolver } from '@pages/load/resolvers/load-details.resolver';
import { LoadDetailsMinimalResolver } from '@pages/load/resolvers/laod-details-minimal.resolver';

// components
import { LoadTableComponent } from '@pages/load/pages/load-table/load-table.component';
import { LoadCardsContainerComponent } from '@pages/load/pages/load-cards-container/load-cards-container.component';

const routes: Routes = [
    {
        path: '',
        component: LoadTableComponent,
        data: { title: 'Load' },
    },
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/load/pages/load-details/load-details.component'
            ).then((m) => m.LoadDetailsComponent),
        resolve: {
            loadItem: LoadDetailsResolver,
            loadMinimalList: LoadDetailsMinimalResolver,
        },
        data: { title: 'Load Details' },
    },
    {
        path: 'card',
        component: LoadCardsContainerComponent,
        data: { title: 'Load Cards' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoadRoutingModule {}
