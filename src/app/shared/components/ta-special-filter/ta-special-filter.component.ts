import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaAppTooltipV2Component } from '../app-tooltip-v2/ta-app-tooltip-v2.component';

//Pipe
import { TaSvgPipe } from 'src/app/shared/pipes/ta-svg.pipe';
import { FilterClassPipe } from 'src/app/shared/components/ta-special-filter/pipes/filter-class.pipe';

//Enum
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

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
    constructor() {}

    public activeFilter: boolean = false;
    public hoverClose: boolean = false;
    public hoverFilter: boolean = false;

    @Input() type: string = TableStringEnum.USER_FILTER;
    @Input() icon: string = TableStringEnum.USER_1;
    @Input() filterTitle: string = '';
    @Input() dataArray: any = [];
    @Input() selectedFilter: boolean;
    @Output() setFilter = new EventEmitter<{
        data?: any;
        selectedFilter?: boolean;
    }>();

    ngOnInit(): void {
        this.activeFilter = this.selectedFilter;
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
}
