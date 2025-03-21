import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { MilesMapUnitListComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-list/miles-map-unit-list.component';
import { MilesMapUnitTotalComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-total/miles-map-unit-total.component';
import { CaMapComponent, ICaMapProps } from 'ca-components';

// TODO: Ognjen
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';

@Component({
    selector: 'app-miles-map',
    templateUrl: './miles-map.component.html',
    styleUrl: './miles-map.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MilesMapUnitListComponent,
        MilesMapUnitTotalComponent,
        CaMapComponent,
    ],
})
export class MilesMapComponent {
    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;
}
