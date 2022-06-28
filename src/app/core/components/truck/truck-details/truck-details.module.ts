import { TruckDetailsItemComponent } from './truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckDetailsRoutes } from './truck-details.routing';
import { TruckDetailsCardComponent } from '../truck-details-card/truck-details-card.component';

@NgModule({
    declarations:[
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        TruckDetailsCardComponent
       
    ],
    exports:[TruckDetailsCardComponent,SharedModule],
    imports:[
        CommonModule,
        TruckDetailsRoutes,
        TruckassistProgressExpirationModule,
        SharedModule,
    ],
   
})
export class TruckDetailsModule{}