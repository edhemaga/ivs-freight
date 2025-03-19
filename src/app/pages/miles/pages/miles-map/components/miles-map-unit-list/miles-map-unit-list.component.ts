import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Form
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import {
    MilesByUnitPaginatedStopsResponse,
    MilesService,
} from 'appcoretruckassist';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes';
import { MilesIconPipe } from '@pages/miles/pipes/miles-icon.pipe';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { CaInputComponent } from 'ca-components';

@Component({
    selector: 'app-miles-map-unit-list',
    templateUrl: './miles-map-unit-list.component.html',
    styleUrl: './miles-map-unit-list.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Pipes
        ThousandSeparatorPipe,
        MilesIconPipe,

        // Components
        SvgIconComponent,
        CaInputComponent,
    ],
})
export class MilesMapUnitListComponent {
    public isStopListExpanded: boolean = false;

    total: MilesByUnitPaginatedStopsResponse;

    public searchForm = this.formBuilder.group({
        search: null,
    });

    constructor(
        public milesService: MilesService,
        private formBuilder: UntypedFormBuilder
    ) {
        this.milesService.apiMilesUnitGet(null, null, 368).subscribe((data) => {
            this.total = data;
            console.log(data);
        });
    }
    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }
}
