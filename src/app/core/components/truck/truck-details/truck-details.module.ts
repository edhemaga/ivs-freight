import { TruckDetailsItemComponent } from './truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { NgModule } from "@angular/core";
import { TruckDetailsCardComponent } from './truck-details-card/truck-details-card.component';
import { RenderMultipleItemsPipe } from './truck-details-item/renderMultipleItems.pipe';
import { TruckFhwaModalComponent } from './truck-modals/truck-fhwa-modal/truck-fhwa-modal.component';
import { TruckPurchaseModalComponent } from './truck-modals/truck-purchase-modal/truck-purchase-modal.component';
import { TruckRegistrationModalComponent } from './truck-modals/truck-registration-modal/truck-registration-modal.component';
import { TruckTitleModalComponent } from './truck-modals/truck-title-modal/truck-title-modal.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckDetailsRoutes } from './truck-details.routing';

@NgModule({
    declarations:[
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        TruckDetailsCardComponent,
        RenderMultipleItemsPipe,

        //Modals truck
        TruckFhwaModalComponent,
        TruckPurchaseModalComponent,
        TruckRegistrationModalComponent,
        TruckTitleModalComponent
    ],
    imports:[
        CommonModule,
        TruckDetailsRoutes,
        TruckassistProgressExpirationModule,
        SharedModule
    ]
})
export class TruckDetailsModule{}