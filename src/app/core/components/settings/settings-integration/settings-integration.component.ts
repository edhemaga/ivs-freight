import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { getIntegrationColumnDefinition } from './integration-columns';
import { HttpClient } from '@angular/common/http';
import { SettingsIntegrationService } from './state/company-integration.service';
@Component({
    selector: 'app-settings-integration',
    templateUrl: './settings-integration.component.html',
    styleUrls: ['./settings-integration.component.scss'],
})
export class SettingsIntegrationComponent implements OnInit {
    tableOptions: any = {};
    selectedTab;
    tableData;
    trucksActive;
    truckActiveQuery;
    trucksInactive;
    truckInactiveQuery;
    public activeViewMode = 'List';
    constructor(
        private http: HttpClient,
        private integrationService: SettingsIntegrationService
    ) {}
    ngOnInit(): void {
        this.sendTruckData();
        const obs = this.http.get(
            'https://localhost:7226/api/integration/list?PageIndex=32&PageSize=32&CompanyId=1'
        );
        obs.subscribe((res) => {
            console.log(res);
        });
    }
    sendTruckData() {
        this.initTableOptions();

        // const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

        const truckActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        // // const truckInactiveData =
        // //     this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                // length: truckCount.active,
                data: truckActiveData,
                gridNameTitle: 'Truck',
                stateName: 'trucks',
                tableConfiguration: 'TRUCK',
                isActive: this.selectedTab === 'active',
                // gridColumns: this.getGridColumns('TRUCK'),
            },
            // {
            //     title: 'Inactive',
            //     field: 'inactive',
            //     length: truckCount.inactive,
            //     data: truckInactiveData,
            //     gridNameTitle: 'Truck',
            //     stateName: 'trucks',
            //     tableConfiguration: 'TRUCK',
            //     isActive: this.selectedTab === 'inactive',
            //     gridColumns: this.getGridColumns('TRUCK'),
            // },
        ];

        // const td = this.tableData.find((t) => t.field === this.selectedTab);

        // this.setTruckData(td);
    }
    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.trucksActive = this.truckActiveQuery.getAll();

            return this.trucksActive?.length ? this.trucksActive : [];
        } else if (dataType === 'inactive') {
            this.trucksInactive = this.truckInactiveQuery.getAll();

            return this.trucksInactive?.length ? this.trucksInactive : [];
        }
    }
    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {},
            actions: [
                {
                    title: 'Edit Truck',
                    name: 'edit-truck',
                    class: 'regular-text',
                    contentType: 'edit',
                },
                {
                    title: 'Add Registration',
                    name: 'add-registration',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Add Inspection',
                    name: 'add-inspection',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Add Repair',
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
}
