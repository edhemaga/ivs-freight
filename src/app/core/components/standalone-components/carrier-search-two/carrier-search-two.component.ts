import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-carrier-search-two',
    templateUrl: './carrier-search-two.component.html',
    styleUrls: ['./carrier-search-two.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbTooltipModule],
})
export class CarrierSearchTwoComponent implements AfterViewInit {
    @ViewChild('searchInput') public searchInput!: ElementRef;

    @Input() placeHolderText: string;

    @Output() searchValueEmitter = new EventEmitter<string>();

    public displaySearch: boolean = false;
    public isValueConfirmed: boolean = false;
    public isInputFocused: boolean = false;

    constructor() {}

    ngAfterViewInit(): void {
        this.handleSearchValue();
    }

    public toggleSearch(): void {
        this.displaySearch = !this.displaySearch;

        if (!this.displaySearch) {
            this.searchInput.nativeElement.value = null;

            this.isInputFocused = false;
            this.isValueConfirmed = false;
        } else {
            this.searchInput.nativeElement.focus();
        }
    }

    public handleSearchValue(): void {
        fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                map((event: Event) => (event.target as HTMLInputElement).value),
                debounceTime(2000),
                distinctUntilChanged()
            )
            .subscribe((searchValue) =>
                this.searchValueEmitter.emit(searchValue)
            );
    }

    public handleSearchFocus(focused: boolean): void {
        if (focused) {
            this.isInputFocused = true;
        } else {
            this.isInputFocused = false;
        }
    }

    public handleClearClick(): void {
        if (this.searchInput.nativeElement.value) {
            this.searchInput.nativeElement.value = null;
        }

        if (this.isValueConfirmed) {
            this.isValueConfirmed = false;
        }

        this.searchInput.nativeElement.focus();
    }

    public handleConfirmClick(): void {
        if (!this.searchInput.nativeElement.value) {
            this.searchInput.nativeElement.focus();

            return;
        }

        this.isValueConfirmed = true;
    }
}
