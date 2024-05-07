import { Component, EventEmitter, Input, Output } from '@angular/core';

//modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

//models
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';

//pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    standalone: true,
    imports: [
        //modules
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        //components
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaAppTooltipV2Component,
        TaInputDropdownTableComponent,

        //pipes
        TrackByPropertyPipe,
    ],
})
export class LoadCardComponent {
    @Input() card: CardDetails;
    @Input() index: number;
    @Input() isExpandCardChecked: boolean;
    @Input() selectedTab: string;
    @Input() cardTitleLink: string;
    @Input() cardFront: CardDataResult[];
    @Input() cardBack: CardDataResult[];
    @Input() isAllCardsFlipp: boolean;
    @Input() isCardFlipped: boolean;
    @Input() title: string;

    @Output() onCheckboxSelect: EventEmitter<{
        index: number;
        card: CardDetails;
    }> = new EventEmitter();
    @Output() flipCardClick: EventEmitter<number> = new EventEmitter();
    @Output() detailsPageClick: EventEmitter<{
        card: CardDetails;
        link: string;
    }> = new EventEmitter();

    constructor() {}

    public emitOnCheckboxSelect(index: number, card: CardDetails): void {
        this.onCheckboxSelect.emit({ index, card });
    }

    public emitFlipCardClick(index: number): void {
        this.flipCardClick.emit(index);
    }

    public emitDetailsPageClick(card: CardDetails, link: string): void {
        this.detailsPageClick.emit({ card, link });
    }
}
