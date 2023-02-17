import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getIntegrationsColumnDefinition } from 'src/assets/utils/settings/integration-columns';
import { IntegrationActiveQuery } from './state/integration-active.query';
import moment from 'moment';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
@Component({
    selector: 'app-settings-integration',
    templateUrl: './settings-integration.component.html',
    styleUrls: ['./settings-integration.component.scss'],
})
export class SettingsIntegrationComponent implements OnInit, AfterViewInit {
    tableOptions: any = {};
    columns: any[] = [];
    viewData: any[] = [];
    selectedTab = 'active';
    tableData;
    integrationsActive;
    public activeViewMode = 'List';
    resizeObserver: ResizeObserver;
    constructor(
        private integrationActiveQuery: IntegrationActiveQuery,
        private tableService: TruckassistTableService
    ) {}
    ngOnInit(): void {
        this.sendIntegrationsData();
    }
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
            toolbarActions: {},
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-table',
                    class: 'regular-text',
                    contentType: 'edit',
                },
                {
                    title: 'Website',
                    name: 'add-registration',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Share',
                    name: 'add-inspection',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Print',
                    name: 'add-repair',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Activate',
                    reverseTitle: 'Deactivate',
                    name: 'activate-item',
                    class: 'regular-text',
                    contentType: 'activate',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'integrations',
                    text: 'Are you sure you want to delete integration(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
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
    onToolBarAction(event) {
        console.log(event);
    }
    onTableBodyActions(event) {
        console.log(event);
    }
    onTableHeadActions(event) {
        console.log(event);
    }
    getTabData() {
        this.integrationsActive = this.integrationActiveQuery.getAll();

        return this.integrationsActive?.length ? this.integrationsActive : [];
    }

    convertDate = (date: string) => {
        return moment.utc(date).local().format('MM/DD/YY hh:mm A');
    };

    getHidenCharacters(data: any) {
        let caracters: any = '';
        for (let i = 0; i < data.password.length; i++) {
            caracters += '<div class="password-characters-container"></div>';
        }
        return caracters;
    }
}
