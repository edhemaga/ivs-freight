import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Pipes
import { TaSvgPipe } from '@shared/pipes/ta-svg.pipe';
import { FilterClassPipe } from '@shared/components/ta-special-filter/pipes/filter-class.pipe';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

@Component({
    selector: 'app-ta-special-filter',
    standalone: true,
    templateUrl: './ta-special-filter.component.html',
    styleUrls: ['./ta-special-filter.component.scss'],
    imports: [
        TaAppTooltipV2Component,
        NgbModule,
        AngularSvgIconModule,
        TaSvgPipe,
        CommonModule,
        FilterClassPipe,
    ],
})
export class TaSpecialFilterComponent implements OnInit {
    constructor(private tableService: TruckassistTableService) {}

    private destroy$ = new Subject<void>();

    public activeFilter: boolean = false;
    public hoverClose: boolean = false;
    public hoverFilter: boolean = false;

    @Input() type: string = TableStringEnum.USER_FILTER;
    @Input() icon: string = TableStringEnum.USER_1;
    @Input() filterTitle: string = '';
    @Input() dataArray: any = [];
    @Input() selectedFilter: boolean;
    @Input() isCountHidden: boolean = false;
    @Output() setFilter = new EventEmitter<{
        data?: any;
        selectedFilter?: boolean;
        isReset?: boolean;
    }>();

    ngOnInit(): void {
        this.activeFilter = this.selectedFilter;

        this.resetFiltersSubscribe();
    }

    public toggleSpecialFilter(): void {
        this.activeFilter = !this.activeFilter;

        if (this.activeFilter) {
            this.setFilter.emit(this.dataArray);
        } else {
            this.hoverClose = false;
            this.setFilter.emit({ ...this.dataArray, selectedFilter: false });
        }
    }

    private resetFiltersSubscribe(): void {
        this.tableService.isSpecialFiltersReset
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.isReset) {
                    if (!res.filterType || res.filterType === this.type) {
                        this.activeFilter = false;

                        this.setFilter.emit({
                            ...this.dataArray,
                            selectedFilter: false,
                            isReset: true,
                        });
                    }
                }
            });
    }
}
