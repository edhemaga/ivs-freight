import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getOwnerColumnDefinition } from 'src/assets/utils/settings/owner-columns';
import { OwnerModalComponent } from '../../modals/owner-modal/owner-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-owner-table',
  templateUrl: './owner-table.component.html',
  styleUrls: ['./owner-table.component.scss'],
})
export class OwnerTableComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getOwnerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendOwnerData();
        }
      });
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: true,
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
          title: 'Edit',
          name: 'edit-owner',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete-owner',
          type: 'owner',
          text: 'Are you sure you want to delete owner(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getOwnerData() {
    this.sendOwnerData();
  }

  sendOwnerData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 15,
        data: this.getDumyData(15),
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setOwnerData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getOwnerColumnDefinition();
    }
  }

  setOwnerData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [
      {
        id: 233,
        companyId: 1,
        ownerCompanyId: null,
        driverId: null,
        businessName: 'RSF ENTERPRISES INC',
        categoryId: null,
        category: 'Company',
        taxNumber: '30-0875663',
        bankId: 1,
        accountNumber: '291016088388',
        routingNumber: '051000017',
        address: null,
        street: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        inactiveTruckCount: 1,
        inactiveTrailerCount: 0,
        activeTruckCount: 1,
        activeTrailerCount: 1,
        status: 1,
        used: 0,
        protected: 0,
        doc: {
          additionalData: {
            email: 'rsfenterprises17@gmail.com',
            phone: '(702) 803-4272',
            address: {
              city: 'Downers Grove',
              state: 'Illinois',
              address: '420 74th St, Downers Grove, IL 60516, USA',
              country: 'US',
              zipCode: '60516',
              addressUnit: '203',
              stateShortName: 'IL',
            },
            bankData: {
              id: 1,
              bankLogo: 'bank-of-america',
              bankName: 'Bank of America',
              bankLogoWide: 'bank-of-america-wide',
              accountNumber: '291016088388',
              routingNumber: '051000017',
            },
          },
        },
        createdAt: '2021-01-18T00:18:12',
        updatedAt: '2021-06-17T19:12:28',
        analyticsTimeSeries: null,
        guid: '296cf410-836c-4dd3-b734-dfb03f474dcc',
        textPhone: '(702) 803-4272',
        textEmail: 'rsfenterprises17@gmail.com',
        textAddress: '420 74th St, Downers Grove, IL 60516, USA',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[0]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(OwnerModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setOwnerData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit-owner') {
      this.modalService.openModal(
        OwnerModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
        }
      );
    }
  }
}
