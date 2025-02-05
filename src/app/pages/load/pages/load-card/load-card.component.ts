import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format-am-pm.pipe';

// Svg-Routes
import { LoadCardSvgRoutes } from '@pages/load/pages/load-card/utils/svg-routes/load-card-svg-routes';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    providers: [
        // Pipes
        FormatCurrencyPipe,
        TimeFormatPipe,

        //Helpers
        CardHelper,
    ],
})
export class LoadCardComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Card body keys
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    @Input() cardTitle: string;
    @Input() rows: number[];

    @Input() cardTitleLink: string;
    @Input() selectedTab: string;

    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    private destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public loadImageRoutes = LoadCardSvgRoutes;

    constructor(
        protected router: Router,

        // Services
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        protected modalService: ModalService,
        public imageBase64Service: ImageBase64Service,
        public loadStoreService: LoadStoreService,

        // Helpers
        private cardHelper: CardHelper
    ) {
        super(loadStoreService);
    }

    ngOnInit() {
        this.flipAllCards();
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public trackCard(item: number): number {
        return item;
    }

    public saveNoteValue(note: string, id: number): void {
        this.saveValueNote.emit({
            value: note,
            id: id,
        });
    }

    public handleToggleDropdownMenuActions<T>(
        event: DropdownMenuOptionEmit,
        cardData: T
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitEvent,
            DropdownMenuStringEnum.LOAD,
            this.selectedTab
        );
    }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
