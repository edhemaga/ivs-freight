import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OnDestroy } from '@angular/core';

//Components
import { TaSearchComponent } from 'src/app/shared/components/ta-search/ta-search.component';
import { TaFilterComponent } from '../../../../../../shared/components/ta-filter/ta-filter.component';
import { TaSpecialFilterComponent } from 'src/app/shared/components/ta-special-filter/ta-special-filter.component';

//Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

//Pipe
import { MoneyFilterPipe } from 'src/app/core/pipes/money-filter.pipe';
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';

//Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-toolbar-filters',
    templateUrl: './toolbar-filters.component.html',
    styleUrls: ['./toolbar-filters.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaSearchComponent,
        TaFilterComponent,
        AngularSvgIconModule,
        FormatCurrency,
        MoneyFilterPipe,
        TaSpecialFilterComponent,
    ],
})
export class ToolbarFiltersComponent implements OnInit, OnChanges, OnDestroy {
    @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
    @Input() options: any;
    @Input() activeTableData: any;
    public loadFilterData: { name: string; active: boolean }[] = [
        {
            name: ConstantStringTableComponentsEnum.ALL,
            active: true,
        },
        {
            name: ConstantStringTableComponentsEnum.FTL,
            active: false,
        },
        {
            name: ConstantStringTableComponentsEnum.LTL,
            active: false,
        },
    ];
    public showLtl: boolean = true;
    public showFtl: boolean = true;
    constructor(private tableSevice: TruckassistTableService) {}
    public customerFilter: { filteredArray: any; selectedFilter: boolean } = {
        filteredArray: [],
        selectedFilter: false,
    };

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {}

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;
        }

        if (
            !changes?.activeTableData?.firstChange &&
            changes?.activeTableData
        ) {
            this.activeTableData = changes.activeTableData.currentValue;
        }
    }

    // On Change Mode View
    changeModeView(modeView: string) {
        this.options.toolbarActions.viewModeOptions =
            this.options.toolbarActions.viewModeOptions.map((viewMode: any) => {
                viewMode.active = viewMode.name === modeView;

                return viewMode;
            });

        this.toolbarFilter.emit({
            mode: modeView,
        });
    }

    public changeFilterView(event: string): void {
        this.loadFilterData.map((filterData) => {
            filterData.active = filterData.name === event ?? false;
            if (filterData.active) {
                if (filterData.name == ConstantStringTableComponentsEnum.ALL) {
                    this.showFtl = true;
                    this.showLtl = true;
                } else if (
                    filterData.name == ConstantStringTableComponentsEnum.FTL
                ) {
                    this.showFtl = true;
                    this.showLtl = false;
                } else if (
                    filterData.name == ConstantStringTableComponentsEnum.LTL
                ) {
                    this.showFtl = false;
                    this.showLtl = true;
                }
            }
        });
    }

    // On Filter
    onFilter(event: any) {
        this.tableSevice.sendCurrentSetTableFilter(event);
    }

    //On special filter
    public onSpecialFilter(event: any, data: string): void {
        if (this.activeTableData?.ftlArray)
            this.activeTableData.ftlArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.FTL_ARRAY ?? false;

        if (this.activeTableData?.ltlArray)
            this.activeTableData.ltlArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.LTL_ARRAY ?? false;

        if (this.activeTableData?.repairArray)
            this.activeTableData.repairArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.REPAIR_ARRAY ?? false;

        if (this.activeTableData?.fuelArray)
            this.activeTableData.fuelArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.FUEL_ARRAY ?? false;

        if (this.activeTableData?.closedArray)
            this.activeTableData.closedArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.CLOSED_ARRAY ?? false;

        if (this.activeTableData?.driverArhivedArray)
            this.activeTableData.driverArhivedArray.selectedFilter =
                data ==
                    ConstantStringTableComponentsEnum.DRIVER_ARCHIVED_ARRAY ??
                false;

        if (this.activeTableData?.deactivatedUserArray)
            this.activeTableData.deactivatedUserArray.selectedFilter =
                data ==
                    ConstantStringTableComponentsEnum.DEACTIVATED_ARHIVED_ARRAY ??
                false;

        if (this.activeTableData?.bannedArray)
            this.activeTableData.bannedArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.BAN;

        if (this.activeTableData?.dnuArray)
            this.activeTableData.dnuArray.selectedFilter =
                data == ConstantStringTableComponentsEnum.DNU;

        if (
            this.activeTableData?.dnuArray ||
            this.activeTableData?.bannedArray ||
            this.activeTableData?.closedArray
        ) {
            if (event.selectedFilter) {
                this.customerFilter.filteredArray.push(event.filteredArray[0]);
                this.customerFilter.selectedFilter = event.selectedFilter;
            } else {
                this.customerFilter.filteredArray =
                    this.customerFilter.filteredArray.filter((item) => {
                        return !event.filteredArray.some((removeItem) =>
                            Object.entries(removeItem).every(
                                ([key, value]) => item[key] === value
                            )
                        );
                    });
            }
            if (!this.customerFilter.filteredArray.length) {
                this.customerFilter.selectedFilter = false;
            }
        }
        this.tableSevice.sendCurrentSetTableFilter(
            this.customerFilter?.filteredArray.length
                ? this.customerFilter
                : event
        );
    }
    // --------------------------------NgOnDestroy---------------------------------
    ngOnDestroy(): void {
        this.tableSevice.sendCurrentSetTableFilter(null);
    }
}
