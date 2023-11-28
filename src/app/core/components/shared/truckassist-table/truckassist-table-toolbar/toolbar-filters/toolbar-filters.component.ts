import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
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
import { Subject, map, takeUntil } from 'rxjs';
import { LoadDetails } from '../../../truckassist-cards/dataTypes';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';

interface ResponseData {
    id: number;
    tableData: LoadDetails;
}
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
    ],
})
export class ToolbarFiltersComponent implements OnInit, OnChanges, OnDestroy {
    @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
    @Input() options: any;
    @Input() activeTableData: any;
    private destroy$ = new Subject<void>();
    tableRowsSelected: any;
    currentTotalSum = 0;
    constructor(
        private tableService: TruckassistTableService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        // Rows Selected
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: ResponseData[]) => {
                const totalSum = response.reduce((acc, currentObj) => {
                    const totalValue = Number(
                        currentObj.tableData.loadTotal?.total.replace(
                            /[^0-9.]/g,
                            ''
                        )
                    );
                    return acc + totalValue;
                }, 0);
                this.currentTotalSum = totalSum;
                this.tableRowsSelected = response;
                this.changeDetectorRef.detectChanges();
            });
    }

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

    // On Filter
    onFilter(event: any) {
        this.tableService.sendCurrentSetTableFilter(event);
    }

    // --------------------------------NgOnDestroy---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next(); // Emitirajte vrijednost kako bi se prekinula pretplata
        this.destroy$.complete();
        this.tableService.sendCurrentSetTableFilter(null);
    }
}
