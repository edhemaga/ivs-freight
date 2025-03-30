import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// routes
import { AuthRoutes } from '@core/routing/auth-routes.routing';
import { PageRoutes } from '@core/routing/page-routes.routing';
import { ListRoutes } from '@core/routing/list-routes.routing';
import { ApplicantRoutes } from '@core/routing/applicant-routes.routing';

const routes: Routes = [
    ...AuthRoutes.routes,
    ...PageRoutes.routes,
    ...ListRoutes.routes,
    ...ApplicantRoutes.routes,

    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}