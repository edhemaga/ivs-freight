import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

// helpers
import { getIntegrationsColumnDefinition } from '@shared/utils/settings/table-settings/integration-columns';

// store
import { IntegrationActiveQuery } from '@pages/settings/state/settings-integration-state/integration-active.query';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// enums
import { eGeneralActions } from '@shared/enums';
@Component({
    selector: 'app-settings-integration',
    templateUrl: './settings-integration.component.html',
    styleUrls: ['./settings-integration.component.scss'],
})
export class SettingsIntegrationComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    columns: any[] = [];
    viewData: any[] = [];
    selectedTab = 'active';
    tableData: any[] = [];
    integrationsActive: any[] = [];
    activeViewMode = 'List';
    resizeObserver: ResizeObserver;

    constructor(
        private integrationActiveQuery: IntegrationActiveQuery,
        private tableService: TruckassistTableService
    ) {}

    // ---------------------------------NgOnInit----------------------------------
    ngOnInit(): void {
        this.sendIntegrationsData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendIntegrationsData();
                }
            });

        // Resize
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((c) => {
                        if (
                            c.title ===
                            response.columns[response.event.index].title
                        ) {
                            c.width = response.event.width;
                        }

                        return c;
                    });
                }
            });

        // Toaggle Columns
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.column) {
                    this.columns = this.columns.map((c) => {
                        if (c.field === response.column.field) {
                            c.hidden = response.column.hidden;
                        }

                        return c;
                    });
                }
            });
    }

    // ---------------------------------NgAfterViewInit----------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showSearchBorder: true,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-table',
                    class: 'regular-text',
                    contentType: eGeneralActions.EDIT_LOWERCASE,
                },
                {
                    title: 'Website',
                    name: 'add-registration',
                    class: 'regular-text',
                    contentType: eGeneralActions.ADD,
                },
                {
                    title: 'Share',
                    name: 'add-inspection',
                    class: 'regular-text',
                    contentType: eGeneralActions.ADD,
                },
                {
                    title: 'Print',
                    name: 'add-repair',
                    class: 'regular-text',
                    contentType: eGeneralActions.ADD,
                },
                {
                    title: 'Activate',
                    reverseTitle: 'Deactivate',
                    name: 'activate-item',
                    class: 'regular-text',
                    contentType: eGeneralActions.ACTIVATE,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'integrations',
                    text: 'Are you sure you want to delete integration(s)?',
                    class: 'delete-text',
                    contentType: eGeneralActions.DELETE_LOWERCASE,
                },
            ],
        };
    }

    sendIntegrationsData() {
        this.initTableOptions();

        const integrationsCount = JSON.parse(
            localStorage.getItem('integrationTableCount')
        );

        const IntegrationsActiveData =
            this.selectedTab === 'active' ? this.getTabData() : [];

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: integrationsCount.active,
                data: IntegrationsActiveData,
                gridNameTitle: 'Integration',
                stateName: 'integration',
                tableConfiguration: 'Integration',
                isActive: true,
                gridColumns: this.getGridColumns(),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setIntegrationsData(td);
    }

    getGridColumns(): any[] {
        return getIntegrationsColumnDefinition();
    }

    setIntegrationsData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapIntegrationsData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    mapIntegrationsData(data: any) {
        return {
            ...data,
            tableCardProvider: 'table card provider',
            tableType: 'aasfasfwa',
            tableUrl: data?.integrationProvider.url
                ? data?.integrationProvider.url
                : '',
            tableUserId: data.userId,
            tableCarrierId: data.carrierId,
            tableIntegrationPassword: {
                hiden: true,
                apiCallStarted: false,
                password: data?.password ? data.password : '',
                hidemCharacters: this.getHidenCharacters(data),
            },
            tableIntegrationConnectedStatus:
                data.integrationConnectedStatus.name,
            tableLastConnected: data?.lastConnected
                ? this.convertDate(data.lastConnected)
                : '',
            tabledisconnectedDate: data?.disconnectedDate
                ? this.convertDate(data.disconnectedDate)
                : '',
        };
    }

    onToolBarAction(_) {}

    onTableBodyActions(_) {}

    onTableHeadActions(_) {}

    getTabData() {
        this.integrationsActive = this.integrationActiveQuery.getAll();

        return this.integrationsActive?.length ? this.integrationsActive : [];
    }

    // Convert Date
    convertDate = (date: string) => {
        return moment.utc(date).local().format('MM/DD/YY hh:mm A');
    };

    // Get Hiden Characters
    getHidenCharacters(data: any) {
        let caracters: any = '';
        for (let i = 0; i < data.password.length; i++) {
            caracters += '<div class="password-characters-container"></div>';
        }
        return caracters;
    }

    // ---------------------------------NgOnDestroy----------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
        this.resizeObserver.disconnect();
    }
}
