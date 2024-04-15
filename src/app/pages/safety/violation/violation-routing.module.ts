import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { RoadsideDetailsResolver } from '@pages/safety/violation/resolvers/roadside-details.resolver';
import { RoadsideMinimalResolver } from '@pages/safety/violation/resolvers/roadside-minimal.resolver';

// components
import { ViolationTableComponent } from '@pages/safety/violation/pages/violation-table/violation-table.component';

const routes: Routes = [
    {
        path: '',
        component: ViolationTableComponent,
        data: { title: 'Violation' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import(
                '@pages/safety/violation/pages/violation-details/violation-details.module'
            ).then((m) => m.ViolationDetailsModule),
        resolve: {
            roadItem: RoadsideDetailsResolver,
            roadMinimal: RoadsideMinimalResolver,
        },
        data: { title: 'Violation Details' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViolationRoutingModule {}
