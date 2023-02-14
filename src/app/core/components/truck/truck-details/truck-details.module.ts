import { TruckDetailsItemComponent } from './truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckDetailsRoutes } from './truck-details.routing';
import { TruckDetailsCardComponent } from '../truck-details-card/truck-details-card.component';
import { SharedModule } from '../../shared/shared.module';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

@NgModule({
    declarations: [
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        TruckDetailsCardComponent,
    ],
    exports: [TruckDetailsCardComponent, SharedModule],
    imports: [
        CommonModule,
        TruckDetailsRoutes,
        SharedModule,
        formatDatePipe
    ],
})
export class TruckDetailsModule {}
