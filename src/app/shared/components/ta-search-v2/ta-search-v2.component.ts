import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-search-v2',
    templateUrl: './ta-search-v2.component.html',
    styleUrls: ['./ta-search-v2.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbTooltipModule],
})
export class TaSearchV2Component implements OnChanges {
    @ViewChild('searchInput') public searchInput!: ElementRef;

    @Input() placeHolderText: string;
    @Input() clearSearchValue?: boolean = false;
    @Input() isDetailsSearchLayout?: boolean = false;

    @Output() searchValueEmitter = new EventEmitter<string>();

    public isValueConfirmed: boolean = false;
    public isInputFocused: boolean = false;
    public isDisplayingButtons: boolean = false;
    public isDetailsSearchLayoutValueValid: boolean = false;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.clearSearchValue?.firstChange &&
            changes.clearSearchValue?.currentValue
        ) {
            this.resetSearchInput();
        }
    }

    public onHandleSearchValue(event: Event): void {
        const searchValue = (event.target as HTMLInputElement).value;

        if (!this.isDetailsSearchLayout) {
            if (searchValue) {
                this.isDisplayingButtons = true;

                return;
            }

            this.isDisplayingButtons = false;

            this.searchValueEmitter.emit(null);
        } else {
            this.isDisplayingButtons = true;

            if (searchValue.length >= 2) {
                this.isDetailsSearchLayoutValueValid = true;

                this.searchValueEmitter.emit(searchValue);
            } else {
                this.isDetailsSearchLayoutValueValid = false;

                this.searchValueEmitter.emit(null);
            }
        }
    }

    public handleSearchFocus(focused: boolean): void {
        this.isInputFocused = focused;

        if (this.isInputFocused && this.searchInput.nativeElement.value) {
            this.isValueConfirmed = false;
        }

        if (!this.isInputFocused && this.searchInput.nativeElement.value)
            this.isValueConfirmed = true;
    }

    public handleConfirmClick(): void {
        this.isValueConfirmed = true;

        this.searchValueEmitter.emit(this.searchInput.nativeElement.value);
    }

    public handleClearClick(): void {
        if (this.searchInput.nativeElement.value)
            this.searchInput.nativeElement.value = null;

        if (this.isValueConfirmed) this.isValueConfirmed = false;

        if (this.isDetailsSearchLayout)
            this.isDetailsSearchLayoutValueValid = false;

        this.searchInput.nativeElement.focus();

        this.searchValueEmitter.emit(null);
    }

    public handleEnterKeyUp(event: { keyCode: number }): void {
        if (event.keyCode === 13) {
            this.handleConfirmClick();
        }
    }

    private resetSearchInput(): void {
        this.searchInput.nativeElement.value = null;

        this.searchValueEmitter.emit(null);

        this.searchInput.nativeElement.focus();

        this.isInputFocused = true;
        this.isValueConfirmed = false;
        this.isDisplayingButtons = false;
    }
}
