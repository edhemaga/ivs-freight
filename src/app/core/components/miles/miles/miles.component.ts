import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getMilesColumnsDefinition } from '../../../../../assets/utils/settings/miles-columns';
import { MilesTableQuery } from '../state/miles.query';

@Component({
    selector: 'app-miles',
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit, AfterViewInit {
    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    columns: any[] = [];
    tableContainerWidth: number = 0;
    resizeObserver: ResizeObserver;
    constructor(private milesTableQuery: MilesTableQuery) {}

    ngOnInit(): void {
        this.sendMilesData();
    }

    sendMilesData() {
        this.initTableOptions();

        const milesCount = JSON.parse(localStorage.getItem('milesTableCount'));
        const milesActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const milesInactiveData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Active Truck',
                field: 'active',
                length: milesCount.active,
                data: milesActiveData,
                extended: false,
                gridNameTitle: 'Miles',
                stateName: 'miles',
                tableConfiguration: 'MILES',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('miles', 'MILES'),
            },
            {
                title: 'Inactive Truck',
                field: 'inactive',
                length: milesCount.inactive,
                data: milesInactiveData,
                extended: false,
                gridNameTitle: 'Miles',
                stateName: 'miles',
                tableConfiguration: 'MILES',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('miles', 'MILES'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setMilesData(td);
    }

    driversActive: any;

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.driversActive = this.milesTableQuery.getAll();
            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === 'inactive') {
            // this.driversInactive = this.driversInactiveQuery.getAll();
            // return this.driversInactive?.length ? this.driversInactive : [];
        }
    }

    setMilesData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.mapMilesData(data);
            });

            console.log('WHAT IS DATA');
            console.log(this.viewData);
        } else {
            this.viewData = [];
        }
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
          this.observTableContainer();
      }, 10);
  }

    mapMilesData(data: any) {
        return {
            ...data,
            isSelected: false,
            unit: data.truck.truckNumber,
            truckTypeIcon: data.truck.truckType.logoName,
            truckTypeClass: data.truck.truckType.logoName.replace('.svg', ''),
        };
    }

    getGridColumns(activeTab: string, configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getMilesColumnsDefinition();
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLocationFilter: this.selectedTab !== 'applicants',
                showArhiveFilter: this.selectedTab === 'applicants',
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: this.getTableActions(),
        };
    }

    getTableActions() {
        return this.selectedTab === 'applicants'
            ? [
                  {
                      title: 'Hire Applicant',
                      name: 'hire-applicant',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Resend Invitation',
                      name: 'resend-invitation',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Add to Favourites',
                      name: 'add-to-favourites',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-applicant',
                      type: 'driver',
                      text: 'Are you sure you want to delete applicant(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ]
            : [
                  {
                      title: 'Edit Driver',
                      name: 'edit',
                      class: 'regular-text',
                      contentType: 'edit',
                  },
                  {
                      title: 'Add CDL',
                      name: 'new-licence',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Medical',
                      name: 'new-medical',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add MVR',
                      name: 'new-mvr',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Test',
                      name: 'new-drug',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title:
                          this.selectedTab === 'inactive'
                              ? 'Activate'
                              : 'Deactivate',
                      name: 'activate-item',
                      class: 'regular-text',
                      contentType: 'activate',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-item',
                      type: 'driver',
                      text: 'Are you sure you want to delete driver(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ];
    }

    onToolBarAction(event: any) {
        console.log(event);
    }

    onTableHeadActions(event: any) {
        console.log(event);
    }

    onTableBodyActions(event: any) {
        console.log(event);
    }

    ngOnDestroy(): void {
        // this.destroy$.next();
        // this.destroy$.complete();
        // this.tableService.sendActionAnimation({});
        this.resizeObserver.unobserve(
            document.querySelector('.table-container')
        );
        this.resizeObserver.disconnect();
    }
}
