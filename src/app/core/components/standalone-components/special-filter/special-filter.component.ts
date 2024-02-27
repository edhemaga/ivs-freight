import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { AppTooltipComponent } from '../app-tooltip/app-tooltip.component';

//Pipe
import { TaSvgPipe } from 'src/app/core/pipes/ta-svg.pipe';
import { FilterClassPipe } from 'src/app/core/pipes/filterClass.pipe';

//Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

@Component({
    selector: 'app-special-filter',
    standalone: true,
    templateUrl: './special-filter.component.html',
    styleUrls: ['./special-filter.component.scss'],
    imports: [
        AppTooltipComponent,
        NgbModule,
        AngularSvgIconModule,
        TaSvgPipe,
        CommonModule,
        FilterClassPipe,
    ],
})
export class SpecialFilterComponent implements OnInit, OnChanges {
    constructor() {}

    public activeFilter: boolean = false;
    public hoverClose: boolean = false;
    public hoverFilter: boolean = false;

    @Input() type: string = ConstantStringTableComponentsEnum.USER_FILTER;
    @Input() icon: string = ConstantStringTableComponentsEnum.USER_1;
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedFilter) this.activeFilter = this.selectedFilter;
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
