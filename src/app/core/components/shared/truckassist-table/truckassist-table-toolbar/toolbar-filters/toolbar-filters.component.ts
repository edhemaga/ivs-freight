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
import { CarrierSearchComponent } from 'src/app/core/components/standalone-components/carrier-search/carrier-search.component';
import { FilterComponent } from '../../../../standalone-components/filter/filter.component';
import { OnDestroy } from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { moneyFilterPipe } from 'src/app/core/pipes/moneyFilter.pipe';
import { SpecialFilterComponent } from 'src/app/core/components/standalone-components/special-filter/special-filter.component';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

@Component({
    selector: 'app-toolbar-filters',
    templateUrl: './toolbar-filters.component.html',
    styleUrls: ['./toolbar-filters.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CarrierSearchComponent,
        FilterComponent,
        AngularSvgIconModule,
        formatCurrency,
        moneyFilterPipe,
        SpecialFilterComponent,
    ],
})
export class ToolbarFiltersComponent implements OnInit, OnChanges, OnDestroy {
    @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
    @Input() options: any;
    @Input() activeTableData: any;
    loadFilterData: { name: string; active: boolean }[] = [
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
    showLtl: boolean = true;
    showFtl: boolean = true;
    constructor(private tableSevice: TruckassistTableService) {}

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

    changeFilterView(event: string) {
        this.loadFilterData.map((e) => {
            e.active = e.name === event ?? false;
            if (e.active) {
                if (e.name == ConstantStringTableComponentsEnum.ALL) {
                    this.showFtl = true;
                    this.showLtl = true;
                } else if (e.name == ConstantStringTableComponentsEnum.FTL) {
                    this.showFtl = true;
                    this.showLtl = false;
                } else if (e.name == ConstantStringTableComponentsEnum.LTL) {
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
    onSpecialFilter(event: any, data: string) {
        if (this.activeTableData?.bannedArray) {
            this.activeTableData.bannedArray.selectedFilter =
                data == 'ban' ?? false;
        }
        if (this.activeTableData?.dnuArray) {
            this.activeTableData.dnuArray.selectedFilter =
                data == 'dnu' ?? false;
        }
        if (this.activeTableData?.ftlArray) {
            this.activeTableData.ftlArray.selectedFilter =
                data == 'ftlArray' ?? false;
        }
        if (this.activeTableData?.ltlArray) {
            this.activeTableData.ltlArray.selectedFilter =
                data == 'ltlArray' ?? false;
        }
        if (this.activeTableData?.repairArray) {
            this.activeTableData.repairArray.selectedFilter =
                data == 'repairArray' ?? false;
        }
        if (this.activeTableData?.fuelArray) {
            this.activeTableData.fuelArray.selectedFilter =
                data == 'fuelArray' ?? false;
        }
        if (this.activeTableData?.closedArray) {
            this.activeTableData.closedArray.selectedFilter =
                data == 'closedArray' ?? false;
        }
        if (this.activeTableData?.driverArhivedArray) {
            this.activeTableData.driverArhivedArray.selectedFilter =
                data == 'driverArhivedArray' ?? false;
        }
        if (this.activeTableData?.deactivatedUserArray) {
            this.activeTableData.deactivatedUserArray.selectedFilter =
                data == 'deactivatedUserArray' ?? false;
        }
        this.tableSevice.sendCurrentSetTableFilter(event);
    }
    // --------------------------------NgOnDestroy---------------------------------
    ngOnDestroy(): void {
        this.tableSevice.sendCurrentSetTableFilter(null);
    }
}
