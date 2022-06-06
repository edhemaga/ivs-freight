import { TruckDetailsItemComponent } from './truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { NgModule } from "@angular/core";
import { RenderMultipleItemsPipe } from './truck-details-item/renderMultipleItems.pipe';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckDetailsRoutes } from './truck-details.routing';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import {NgApexchartsModule} from "ng-apexcharts";
import { TruckDetailsCardComponent } from '../truck-details-card/truck-details-card.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
@NgModule({
    declarations:[
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        RenderMultipleItemsPipe,
        TruckDetailsCardComponent
       
    ],
    exports:[TruckDetailsCardComponent,PipesModule],
    imports:[
        CommonModule,
        TruckDetailsRoutes,
        TruckassistProgressExpirationModule,
        SharedModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        PipesModule
    ],
   
})
export class TruckDetailsModule{}