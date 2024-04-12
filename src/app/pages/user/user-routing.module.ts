import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { UserTableComponent } from '@pages/user/pages/user-table/user-table.component';

const routes: Routes = [
    {
        path: '',
        component: UserTableComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
