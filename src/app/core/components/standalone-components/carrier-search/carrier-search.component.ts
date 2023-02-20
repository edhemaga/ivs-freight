import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-carrier-search',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, FormsModule, ReactiveFormsModule],
    templateUrl: './carrier-search.component.html',
    styleUrls: ['./carrier-search.component.scss'],
})
export class CarrierSearchComponent implements OnInit, OnChanges, OnDestroy {
    @Input() searchType: string = '';
    @Input() selectedTabData: any = {};
    chips: any[] = [];
    openSearch: boolean;
    searchText = '';
    searchIsActive: boolean = false;
    typingTimeout: any;

    constructor(private tableService: TruckassistTableService) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {}

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges): void {
        // Search Type
        if (!changes?.searchType?.firstChange && changes?.searchType) {
            this.searchType = changes.searchType.currentValue;
        }

        // Selected Tab Data
        if (
            !changes?.selectedTabData?.firstChange &&
            changes?.selectedTabData
        ) {
            this.selectedTabData = changes.selectedTabData.currentValue;
        }
    }

    // Open Search
    toggleSearch() {
        this.openSearch = !this.openSearch;

        if (this.openSearch && this.chips.length < 3) {
            setTimeout(() => {
                document.getElementById('table-search').focus();
            }, 100);
        }
    }

    // On Typing Send Search
    onTyping(event: KeyboardEvent) {
        clearTimeout(this.typingTimeout);

        const searchNumber = !this.chips.length
            ? 'searchOne'
            : this.chips.length === 1
            ? 'searchTwo'
            : 'searchThree';

        if (event.key !== 'Enter') {
            this.typingTimeout = setTimeout(() => {
                if (this.searchText.length >= 3) {
                    this.searchIsActive = true;

                    this.tableService.sendCurrentSearchTableData({
                        chip: searchNumber,
                        search: this.searchText,
                        searchType: this.searchType,
                    });
                } else if (this.searchIsActive && this.searchText.length < 3) {
                    this.searchIsActive = false;

                    this.tableService.sendCurrentSearchTableData({
                        chip: searchNumber,
                        doReset: true,
                        all: searchNumber === 'searchOne',
                        searchType: this.searchType,
                    });
                }
            }, 500);
        }
    }

    // On Enter Action
    onEnter() {
        if (this.chips.length < 3) {
            this.chips.push({
                searchText: this.searchText,
                color: this.getChipColor(this.chips.length),
                canDoAnimation: true,
                query: this.getChipQuery(this.chips.length),
            });

            this.tableService.sendCurrentSearchTableData({
                chipAdded: true,
                search: this.searchText,
                query: this.getChipQuery(this.chips.length - 1),
                searchType: this.searchType,
            });

            this.searchText = '';
            this.searchIsActive = false;
        }
    }

    // On Delete Chip
    onDeleteChip(index: number) {
        this.chips.splice(index, 1);

        if (this.chips.length) {
            this.chips = this.chips.map((chip, i) => {
                chip = {
                    searchText: chip.searchText,
                    color: this.getChipColor(i),
                    canDoAnimation: false,
                    query: this.getChipQuery(i),
                };

                return chip;
            });
        }

        if (this.openSearch) {
            setTimeout(() => {
                document.getElementById('table-search').focus();
            }, 100);
        }

        this.tableService.sendCurrentSearchTableData({
            isChipDelete: true,
            search: this.searchText?.length >= 3 ? this.searchText : undefined,
            addToQuery: this.getChipQuery(this.chips.length),
            querys: ['searchOne', 'searchTwo', 'searchThree'],
            chips: this.chips,
            searchType: this.searchType,
        });
    }

    // Get Chip Color
    getChipColor(index: number) {
        const chipsColors = ['#4DB6A2', '#BA68C8', '#FFB74D'];

        return chipsColors[index];
    }

    // Get Chip Query
    getChipQuery(index: number) {
        const chipsQuery = ['searchOne', 'searchTwo', 'searchThree'];

        return chipsQuery[index];
    }

    // --------------------------------NgOnChanges---------------------------------
    ngOnDestroy(): void {
        this.tableService.sendCurrentSearchTableData(null);
    }
}
