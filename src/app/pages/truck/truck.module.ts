//modules
import { TruckRoutingModule } from './truck-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TruckTableComponent } from './pages/truck-table/truck-table.component';
import { TruckCardComponent } from './pages/truck-card/truck-card.component';

import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';

//pipes

@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        //modules
        CommonModule,
        TruckRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        //pipes
        TaThousandSeparatorPipe,
        DatePipe,
    ],
})
export class TruckModule {}
