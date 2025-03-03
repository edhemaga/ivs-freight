import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaSearchMultipleStatesComponent } from 'ca-components';

// enums
import { eVehicleList } from '@shared/components/ca-vehicle-list/enums';

// constants
import { VehicleListConstants } from '@shared/components/ca-vehicle-list/utils/constants';

// pipes
import { DispatchColorFinderPipe, ThousandSeparatorPipe } from '@shared/pipes';

// svg routes
import { VehicleListSvgRoutes } from '@shared/components/ca-vehicle-list/utils/svg-routes';

// interfaces
import { IVehicleListActionsEmit } from '@shared/components/ca-vehicle-list/interfaces/vehicle-list-actions-emit.interface';
import { IVehicleListConfig } from '@shared/components/ca-vehicle-list/interfaces';

// models
import {
    FuelledVehicleResponse,
    RepairedVehicleResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-ca-vehicle-list',
    templateUrl: './ca-vehicle-list.component.html',
    styleUrl: './ca-vehicle-list.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        CaSearchMultipleStatesComponent,

        // pipes
        ThousandSeparatorPipe,
        DispatchColorFinderPipe,
    ],
})
export class CaVehicleListComponent implements OnInit {
    @Input() set vehicleListConfig(data: IVehicleListConfig) {
        this._vehicleListConfig = data;
    }

    @Output() vehicleListActionsEmitter =
        new EventEmitter<IVehicleListActionsEmit>();

    public _vehicleList: (RepairedVehicleResponse | FuelledVehicleResponse)[] =
        [];

    public _vehicleListConfig: IVehicleListConfig;

    // svg routes
    public vehicleListSvgRoutes = VehicleListSvgRoutes;

    // enums
    public eVehicleList = eVehicleList;

    // header
    public vehicleListHeaderItems: string[];

    // helper indexes
    public vehicleHoverIndex: number = -1;

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    private getConstantData(): void {
        this.vehicleListHeaderItems =
            VehicleListConstants.VEHICLE_LIST_HEADER_ITEMS;
    }

    public handleVehicleTypeHoverAction(vehicleIndex?: number): void {
        this.vehicleHoverIndex = vehicleIndex;
    }

    public handleClickActions(action?: IVehicleListActionsEmit): void {
        this.vehicleListActionsEmitter.emit(action);
    }
}
