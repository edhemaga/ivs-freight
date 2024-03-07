import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    Self,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// model
import { CardRows } from '../../../shared/model/cardData';

// store
import { LoadQuery } from '../state/store/load-modal.query';

// enum
import { CardModalEnums } from '../utils/enums/card-modals.enums';

@Component({
    selector: 'app-modal-input-form',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbModule],
    templateUrl: './modal-input-form.component.html',
    styleUrls: ['./modal-input-form.component.scss'],
})
export class ModalInputFormComponent implements ControlValueAccessor {
    @ViewChild('inputTitleValue') public inputTitleValue: ElementRef;

    public _dataCardsModal: CardRows[];
    public filteredCardsModalData: CardRows[];

    @Input() set dataCardModal(value: CardRows[]) {
        this._dataCardsModal = value;

        this.filteredCardsModalData = value;

        this.cdr.detectChanges();
    }

    @Input() defaultValue: CardRows;
    @Input() backupValue: string;

    private destroy$ = new Subject<void>();

    public tooltip: NgbTooltip;

    public lattersToHighlight: string;

    public selectedValueInInput: string;
    public allSelectedValuesInAllInputs: CardRows[];
    public titleAlredySelectedInotherInput: boolean = false;

    public showRemoveIcon: boolean = false;
    public valueChangedInput: boolean = false;

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
        private loadQuery: LoadQuery
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

    public hasMatchingTitle(title: string): boolean {
        return this.allSelectedValuesInAllInputs.some(
            (item) => item && title === item.title
        );
    }

    public toggleCardsModalDropdown(
        tooltip: NgbTooltip,
        card: CardRows[]
    ): void {
        this.selectedValueInInput = this.inputTitleValue.nativeElement.value;

        this.showRemoveIcon = true;

        tooltip.open({ titles: card });
    }

    public cardTitleSelected(selectedRow: CardRows, popover: NgbPopover): void {
        switch (selectedRow.title) {
            case CardModalEnums.EMPTY:
                this.showRemoveIcon = false;

                const emptyObj = {
                    title: CardModalEnums.EMPTY,
                    endpoint: CardModalEnums.EMPTY,
                };

                this.inputTitleValue.nativeElement.value = this.backupValue;

                this.valueChangedInput = false;

                this.onChange({ ...emptyObj });

                break;

            default:
                this.inputTitleValue.nativeElement.value = selectedRow.title;

                this.valueChangedInput = true;

                this.onChange({ ...selectedRow });

                if (popover) {
                    this.showRemoveIcon = false;

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
                    this.filteredCardsModalData = [...filteredInModalTitles];
                }
            }
        }
    }

    private filterModal(searchString: string): CardRows[] {
        const filterTrucks = this.filteredCardsModalData.filter((title) =>
            title.title.toLowerCase().includes(searchString)
        );

        return filterTrucks;
    }
}
