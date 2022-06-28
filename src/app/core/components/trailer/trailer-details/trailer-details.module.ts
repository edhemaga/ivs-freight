
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckDetailsRoutes } from "./trailer-details.routing";
import { TrailerDetailsComponent } from './trailer-details.component';
import { TrailerDetailsItemComponent } from './trailer-details-item/trailer-details-item.component';
import { TrailerDetailsCardComponent } from "../trailer-details-card/trailer-details-card.component";
@NgModule({
    declarations:[
        TrailerDetailsComponent,
        TrailerDetailsItemComponent,
        TrailerDetailsCardComponent,
    ],
    exports:[TrailerDetailsCardComponent,SharedModule],
    imports:[
        CommonModule,
        TruckDetailsRoutes,
        TruckassistProgressExpirationModule,
        SharedModule,
    ]
})
export class TrailerDetailsModule{}