import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { BrokerDetailsComponent } from '@pages/customer/pages/broker-details/broker-details.component';

const routes: Routes = [
    {
        path: '',
        component: BrokerDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BrokerDetailsRoutingModule {}
