import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import { LoadMinimalResponse, LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-title-card',
    templateUrl: './load-details-title-card.component.html',
    styleUrls: ['./load-details-title-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaDetailsHeaderCardComponent,

        // pipes
        FormatDatePipe,
    ],
})
export class LoadDetailsTitleCardComponent implements OnInit {
    @Input() cardData: LoadResponse;
    @Input() loadCurrentIndex: number;
    @Input() loadsDropdownList: LoadResponse[];

    @Output() cardValuesEmitter = new EventEmitter<{
        event: LoadMinimalResponse;
        type: string;
    }>();

    constructor() {}

    ngOnInit(): void {}

    public handleCardChanges(event: LoadMinimalResponse, type: string): void {
        this.cardValuesEmitter.emit({ event, type });
    }
}
