import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewLoadRoutingModule } from '@pages/new-load/load-routing.module';

import { NewLoadDetailsComponent } from '@pages/new-load/pages/new-load-details/new-load-details.component';

@NgModule({
    declarations: [],
    imports: [CommonModule, NewLoadRoutingModule, NewLoadDetailsComponent],
})
export class NewLoadModule {}
