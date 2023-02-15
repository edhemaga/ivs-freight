import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getIntegrationsColumnDefinition } from 'src/assets/utils/settings/integration-columns';
import { IntegrationActiveQuery } from './state/integration-active.query';
import moment from 'moment';
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
    trucksActive;
    trucksInactive;
    truckInactiveQuery;
    public activeViewMode = 'List';
    resizeObserver: ResizeObserver;
    tableContainerWidth: number = 0;
    constructor(private integrationActiveQuery: IntegrationActiveQuery) {}
    ngOnInit(): void {
        this.sendTruckData();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }
    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
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
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
        };
    }
    sendTruckData() {
        this.initTableOptions();
        const truckCount = JSON.parse(
            localStorage.getItem('integrationTableCount')
        );
        const truckActiveData =
            this.selectedTab === 'active' ? this.getTabData() : [];

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: truckCount.active,
                data: truckActiveData,
                gridNameTitle: 'Integration',
                stateName: 'integration',
                tableConfiguration: 'Integration',
                isActive: true,
                gridColumns: this.getGridColumns(),
            },
        ];
        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setTruckData(td);
    }
    getGridColumns(): any[] {
        return getIntegrationsColumnDefinition();
    }
    setTruckData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTruckData(data);
            });
        } else {
            this.viewData = [];
        }
    }
    mapTruckData(data: any) {
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
    getTabData() {
        this.trucksActive = this.integrationActiveQuery.getAll();

        return this.trucksActive?.length ? this.trucksActive : [];
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
