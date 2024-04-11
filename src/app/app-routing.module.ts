import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// routes
import { AuthRoutes } from 'src/app/core/routing/auth-routes.routing';
import { PageRoutes } from 'src/app/core/routing/page-routes.routing';
import { ListRoutes } from 'src/app/core/routing/list-routes.routing';
import { ApplicantRoutes } from 'src/app/core/routing/applicant-routes.routing';

const routes: Routes = [
    ...AuthRoutes.routes,
    ...PageRoutes.routes,
    ...ListRoutes.routes,
    ...ApplicantRoutes.routes,

    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
