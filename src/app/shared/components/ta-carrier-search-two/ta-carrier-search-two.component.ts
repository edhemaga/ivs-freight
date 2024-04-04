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
    selector: 'app-ta-carrier-search-two',
    templateUrl: './ta-carrier-search-two.component.html',
    styleUrls: ['./ta-carrier-search-two.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbTooltipModule],
})
export class TaCarrierSearchTwoComponent implements OnChanges {
    @ViewChild('searchInput') public searchInput!: ElementRef;

    @Input() placeHolderText: string;
    @Input() clearSearchValue?: boolean = false;

    @Output() searchValueEmitter = new EventEmitter<string>();

    public isValueConfirmed: boolean = false;
    public isInputFocused: boolean = false;
    public isDisplayingButtons: boolean = false;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.clearSearchValue?.firstChange &&
            changes.clearSearchValue?.currentValue
        ) {
            this.resetSearchInput();
        }
    }

    public handleSearchValue(event: Event): void {
        const searchValue = (event.target as HTMLInputElement).value;

        if (searchValue) {
            this.isDisplayingButtons = true;

            return;
        }

        this.isDisplayingButtons = false;

        this.searchValueEmitter.emit(null);
    }

    public handleSearchFocus(focused: boolean): void {
        this.isInputFocused = focused;

        if (this.isInputFocused && this.searchInput.nativeElement.value) {
            this.isValueConfirmed = false;
        }
    }

    public handleConfirmClick(): void {
        this.isValueConfirmed = true;

        this.searchValueEmitter.emit(this.searchInput.nativeElement.value);
    }

    public handleClearClick(): void {
        if (this.searchInput.nativeElement.value) {
            this.searchInput.nativeElement.value = null;
        }

        if (this.isValueConfirmed) {
            this.isValueConfirmed = false;
        }

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
