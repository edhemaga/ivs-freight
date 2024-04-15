import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    Self,
    ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbModule, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';

// store
import { LoadQuery } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.query';

// enums
import { CardsModalEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

// helpers
import { CardDropdownHelper } from '@shared/utils/helpers/card-dropdown-helper';

@Component({
    selector: 'app-modal-input-form',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbModule],
    templateUrl: './modal-input-form.component.html',
    styleUrls: ['./modal-input-form.component.scss'],
})
export class ModalInputFormComponent implements OnInit, ControlValueAccessor {
    @ViewChild('inputTitleValue') public inputTitleValue: ElementRef;

    @Input() set dataCardModal(value: CardRows[]) {
        this._dataCardsModal = value;

        this.filteredCardsModalData = [...value];

        this.cdr.detectChanges();
    }

    public _dataCardsModal: CardRows[];
    public filteredCardsModalData: CardRows[];

    @Input() defaultValue: CardRows;
    @Input() backupValue: string;

    @Input() titlesInForm: string;

    private destroy$ = new Subject<void>();

    public tooltip: NgbTooltip;

    public lattersToHighlight: string;

    public selectedValueInInput: string;
    public allSelectedValuesInAllInputs: CardRows[];

    public isValueChangedInput: boolean = false;

    get getSuperControl() {
        if (
            this.superControl &&
            this.superControl.control &&
            this.superControl.control.value
        ) {
            return this.superControl.control.value;
        } else {
            return null;
        }
    }

    public writeValue(_: any): void {}
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    public onChange(_: any): void {}
    public registerOnTouched(_: any): void {}

    constructor(
        @Self() public superControl: NgControl,
        private cdr: ChangeDetectorRef,
        private loadQuery: LoadQuery,
        private sanitizer: DomSanitizer
    ) {
        this.superControl.valueAccessor = this;
    }

    ngOnInit() {
        this.getDataFromStore();
    }

    public getDataFromStore(): void {
        this.loadQuery.pending$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.allSelectedValuesInAllInputs = data.front_side;
            });
    }

    public cardTitleSelected(selectedRow: CardRows, popover: NgbPopover): void {
        switch (selectedRow.title) {
            case CardsModalEnum.EMPTY:
                const emptyObj = {
                    title: CardsModalEnum.EMPTY,
                    endpoint: CardsModalEnum.EMPTY,
                };

                this.inputTitleValue.nativeElement.value = this.backupValue;

                this.isValueChangedInput = false;

                this.onChange({ ...emptyObj });

                break;

            default:
                this.inputTitleValue.nativeElement.value = selectedRow.title;

                this.isValueChangedInput = true;

                this.onChange({ ...selectedRow });

                if (popover) {
                    popover.close();
                }
                break;
        }
    }

    public filterArrayCardsModalDropdown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.toLowerCase();

            if (searchTerm.length >= 2) {
                const filteredInModalTitles = this.filterModal(searchTerm);

                this.lattersToHighlight = searchTerm;
                if (!filteredInModalTitles.length) {
                    this.filteredCardsModalData = this._dataCardsModal;
                } else {
                    this.filteredCardsModalData = filteredInModalTitles;
                }
                this.cdr.detectChanges();
            } else {
                this.filteredCardsModalData = this._dataCardsModal;
                this.lattersToHighlight = '';
            }
        }
    }

    private filterModal(searchString: string): CardRows[] {
        const filterTrucks = this.filteredCardsModalData.filter((title) =>
            title.title.toLowerCase().includes(searchString)
        );

        return filterTrucks;
    }

    public higlitsPartOfCommentSearchValue(commentTitle: string): string {
        return CardDropdownHelper.higlitsPartOfCommentSearchValue(
            commentTitle,
            this.lattersToHighlight,
            this.sanitizer
        );
    }

    public toggleCardsModalDropdown(
        tooltip: NgbTooltip,
        card: CardRows[]
    ): void {
        this.selectedValueInInput = this.inputTitleValue.nativeElement.value;

        tooltip.open({ titles: card });
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
