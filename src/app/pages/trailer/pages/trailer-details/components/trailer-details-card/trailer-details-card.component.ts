import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TrailerService } from '@shared/services/trailer.service';

// Animations
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// Store
import { TrailersMinimalListQuery } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.query';

// Models
import { TrailerDropdown } from '@pages/trailer/pages/trailer-details/models/trailer-dropdown.model';
import { TrailerData } from '@pages/trailer/pages/trailer-table/models/trailer-data.model';
import { TrailerFuelConsumptionChartResponse, TrailerFuelConsumptionResponse, TrailerMinimalResponse } from 'appcoretruckassist';
import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';
import { Tabs } from '@shared/models';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Constants
import { TrailerDetailsChartsConfiguration } from '@pages/trailer/pages/trailer-details/utils/constants';
import { ChartConfiguration, ChartLegendConfiguration } from '@shared/utils/constants';

// Helpers
import { ChartHelper } from '@shared/utils/helpers';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';

@Component({
    selector: 'app-trailer-details-card',
    templateUrl: './trailer-details-card.component.html',
    styleUrls: ['./trailer-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('ownerDetailsAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('0.2s ease')]),
            transition('true <=> false', [animate('0.2s ease')]),
        ]),
    ],
})
export class TrailerDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy {
    @Input() trailer: TrailerData;
    @Input() templateCard: boolean = false;

    private destroy$ = new Subject<void>();
    public note: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public inspectionNote: UntypedFormControl = new UntypedFormControl();
    public toggler: boolean[] = [];
    public dataEdit;
    public toggleOwner: boolean;
    public trailerDropDowns: TrailerDropdown[] = [];
    public trailer_list: TrailerMinimalResponse[] =
        this.trailerMinimalQuery.getAll();
    public trailerIndex: number;
    public ownerCardOpened: boolean = true;

    // Chart
    public fuelConsumptionChartConfig!: IChartConfiguration;
    public fuelConsumptionChartLegend!: ChartLegendConfiguration[];
    public fuelConsumptionTabs: Tabs[] = ChartHelper.generateTimeTabs();

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private trailerMinimalQuery: TrailersMinimalListQuery,
        private trailerService: TrailerService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.trailer?.firstChange) {
            this.getTrailerDropdown();
            this.note.patchValue(changes.trailer.currentValue.note);
        }
        this.trailerMinimalQuery.selectAll().subscribe((item) => {
            this.trailer_list = item;
        });
    }

    ngOnInit(): void {
        this.initTableOptions();
        this.getTrailerDropdown();
        setTimeout(() => {
            let currentIndex = this.trailerDropDowns.findIndex(
                (trailer) => trailer.id === this.trailer.id
            );

            this.trailerIndex = currentIndex;
        }, 300);

        this.getTrailerFuelConsumption();
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataEdit = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    class: TableStringEnum.REGULAR_TEXT,
                    contentType: TableStringEnum.EDIT,
                },

                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.DRIVER,
                    text: 'Are you sure you want to delete driver(s)?',
                    class: TableStringEnum.DELETE_TEXT,
                    iconName: TableStringEnum.DELETE,
                },
            ],
            export: true,
        };
    }

    /**Function return format date from DB */
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getTrailerDropdown(): void {
        this.trailerDropDowns = this.trailerMinimalQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.trailerNumber,
                    svg: item.trailerType.logoName,
                    folder: 'common/trailers',
                    status: item.status,
                    active: item.id === this.trailer.id,
                };
            });

        this.trailerDropDowns = this.trailerDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTrailer(event: { id: number }): void {
        if (event && event.id !== this.trailer.id) {
            this.trailerDropDowns = this.trailerMinimalQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.trailerNumber,
                        status: item.status,
                        svg: item.trailerType.logoName,
                        folder: 'common/trailers',
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);

            this.trailerDropDowns = this.trailerDropDowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }

    public onChangeTrailer(action: string): void {
        let currentIndex = this.trailerDropDowns.findIndex(
            (trailer) => trailer.id === this.trailer.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.trailerDropDowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public sortKeys = (a, b) => {
        return a.value.id > b.value.id ? -1 : 1;
    };

    public onOpenCloseCard(isCardOpen: boolean): void {
        this.ownerCardOpened = isCardOpen;
    }

    public getLastSixChars(copyValue): string | string[] {
        let lastSixChars = copyValue;

        if (copyValue.length > 6) {
            lastSixChars = copyValue.slice(-6);

            const stringLength = copyValue.length;
            const firsNum = stringLength - 6;
            lastSixChars = [copyValue.slice(0, firsNum), copyValue.slice(-6)];
        }

        return lastSixChars;
    }

    private getTrailerFuelConsumption(timeFilter?: number): void {
        // If not reefer, return
        if (this.trailer.trailerType.id !== 9) return;
        this.trailerService.getTrailerFuelConsumption(this.trailer.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: TrailerFuelConsumptionResponse) => {
                if (timeFilter && this.fuelConsumptionTabs[timeFilter - 1])
                    this.fuelConsumptionTabs[timeFilter - 1].checked = true;
                this.fuelConsumptionChartConfig = {
                    ...TrailerDetailsChartsConfiguration.PAYROLL_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<TrailerFuelConsumptionChartResponse>(
                        response.trailerFuelConsumptionCharts,
                        ChartConfiguration.trailerFuelExpensesConfiguration,
                        timeFilter
                    ),
                };
                this.fuelConsumptionChartLegend = ChartLegendConfiguration.trailerFuelConsumptionConfiguration(response)
            })
    }

    public changeFuelConsumptionTab(event: TabOptions): void {
        this.getTrailerFuelConsumption(event.id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
