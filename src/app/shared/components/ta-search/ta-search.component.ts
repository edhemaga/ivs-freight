import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';

//Module
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Service
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-ta-search',
    templateUrl: './ta-search.component.html',
    styleUrls: ['./ta-search.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule,
    ],
})
export class TaSearchComponent implements OnInit, OnChanges, OnDestroy {
    @Input() toolbarSearch?: boolean = true;
    @Input() searchType: string = '';
    @Input() selectedTabData: any = {};
    chips: any[] = [];
    openSearch: boolean;
    searchText = '';
    searchIsActive: boolean = false;
    typingTimeout: any;
    chipToDelete: number = -1;
    chipsForHighlightSearch = [];

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
        if (this.chips.length === 3) {
            this.openSearch = false;
        } else {
            this.openSearch = !this.openSearch;

            if (this.openSearch && this.chips.length < 3) {
                setTimeout(() => {
                    document.getElementById('table-search').focus();
                }, 100);
            }
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
        if (!event.key) {
            this.searchIsActive = true;
            this.searchText = '';
            this.sendHighlightSearchOnTyping();

            this.tableService.sendCurrentSearchTableData({
                chip: searchNumber,
                search: this.searchText,
                searchType: this.searchType,
            });
        }
        if (event.key !== 'Enter') {
            this.typingTimeout = setTimeout(() => {
                if (this.searchText.length >= 3) {
                    this.searchIsActive = true;

                    this.sendHighlightSearchOnTyping();

                    this.tableService.sendCurrentSearchTableData({
                        chip: searchNumber,
                        search: this.searchText,
                        searchType: this.searchType,
                    });
                } else if (this.searchIsActive && this.searchText.length < 3) {
                    this.searchIsActive = false;

                    this.sendHighlightSearchOnEnter();

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
        if (this.chips.length < 3 && !this.checkChips()) {
            this.chips.push({
                searchText: this.searchText,
                color: this.getChipColor(this.chips.length),
                canDoAnimation: true,
                query: this.getChipQuery(this.chips.length),
            });

            // Send Chips For Highlight Search To Table
            this.sendHighlightSearchOnEnter();

            // Send Current Table Search
            this.tableService.sendCurrentSearchTableData({
                chipAdded: true,
                search: this.searchText,
                query: this.getChipQuery(this.chips.length - 1),
                searchType: this.searchType,
            });
            this.chips.length === 3 ? this.toggleSearch() : null;
            this.chipToDelete = -1;
            this.searchText = '';
            this.searchIsActive = false;
        }
    }

    // Send Chips For Highlight Search On Typing
    sendHighlightSearchOnTyping() {
        this.chipsForHighlightSearch = [];

        this.chips.map((chip) => {
            this.chipsForHighlightSearch.push(chip.searchText);
        });

        if (this.chips.length <= 2) {
            this.chipsForHighlightSearch.push(this.searchText);
        }

        this.tableService.sendChipsForHighlightSearchToTable(
            this.chipsForHighlightSearch
        );
    }

    // Send Chips For Highlight Search On Enter
    sendHighlightSearchOnEnter() {
        this.chipsForHighlightSearch = [];

        this.chips.map((chip) => {
            this.chipsForHighlightSearch.push(chip.searchText);
        });

        this.tableService.sendChipsForHighlightSearchToTable(
            this.chipsForHighlightSearch
        );
    }

    public handleClearClick(): void {
        if (this.searchText) this.searchText = '';
    }

    // Check If Chips Already Have Search Text
    checkChips(): boolean {
        let hasSearchText = false;

        this.chips.map((chip) => {
            if (chip.searchText === this.searchText) {
                hasSearchText = true;
            }
        });

        return hasSearchText;
    }

    // On Delete Chip
    onDeleteChip(index: number) {
        this.chips.splice(index, 1);

        // Send Chips For Highlight Search To Table
        this.sendHighlightSearchOnEnter();

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

    // On Delete All Chips
    deleteAllChips() {
        this.chips = [];
        this.chipToDelete = -1;

        this.tableService.sendChipsForHighlightSearchToTable([]);

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
        const chipsColors = ['26A690', 'AB47BC', 'FFA726'];

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
