import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  getBrokerColumnDefinition,
  getShipperColumnDefinition,
} from 'src/assets/utils/settings/customer-columns';
import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'broker';
  resetColumns: boolean;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getCustomerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendCustomerData();
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
          name: 'edit-cutomer-or-shipper',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'customer',
          text:
            this.selectedTab === 'broker'
              ? 'Are you sure you want to delete customer(s)?'
              : 'Are you sure you want to delete shipper(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getCustomerData() {
    this.sendCustomerData();
  }

  sendCustomerData() {
    this.tableData = [
      {
        title: 'Broker',
        field: 'broker',
        length: 8,
        data: this.getDumyData(8, 'broker'),
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Broker',
        stateName: 'brokers',
        gridColumns: this.getGridColumns('brokers', this.resetColumns),
      },
      {
        title: 'Shipper',
        field: 'shipper',
        length: 15,
        data: this.getDumyData(15, 'shipper'),
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Shipper',
        stateName: 'shippers',
        gridColumns: this.getGridColumns('shippers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setCustomerData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return stateName === 'brokers'
        ? getBrokerColumnDefinition()
        : getShipperColumnDefinition();
    }
  }

  setCustomerData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getDumyData(numberOfCopy: number, dataType: string) {
    let dataBroker: any[] = [
      {
        id: 61,
        companyId: 1,
        predefinedBrokerId: null,
        name: 'ROADTEX YOUNGSTOWN',
        address: null,
        street: 'Southern Blvd, Dayton, OH, USA',
        city: 'Dayton',
        state: 'Oh',
        country: 'US',
        zip: '',
        longitude: -84.198938,
        latitude: 39.760973,
        email: null,
        phone: null,
        upCount: 2,
        downCount: 0,
        loadCount: 10,
        total: '$12,500',
        thumbUp: 221,
        thumbDown: null,
        latestComment: 'juhuuuuuhuhu',
        status: 1,
        mcNumber: '54',
        hasBillingContact: 0,
        dnu: 0,
        ban: 0,
        protected: 1,
        doc: {
          email: '',
          phone: '(330) 423-4727',
          address: {
            city: 'Dayton',
            state: 'Ohio',
            address: 'Southern Blvd, Dayton, OH, USA',
            country: 'US',
            zipCode: '',
            streetName: 'Southern Boulevard',
            streetNumber: '',
            stateShortName: 'OH',
          },
          dbaName: '',
          addressUnit: 'D',
          contactPersons: [],
        },
        createdAt: null,
        updatedAt: null,
        guid: '3511a282-4f64-4b32-9d7e-e5777aee9711',
        textDbaName: '',
        textPhone: '(330) 423-4727',
        textEmail: '',
        textAddress: 'Southern Blvd, Dayton, OH, USA',
        isSelected: false,
      },
    ];

    let dataShippers: any[] = [
      {
        id: 29,
        companyId: 1,
        name: 'PH FOOD MORTON',
        address: null,
        street: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        longitude: -89.654816,
        latitude: 32.357247,
        email: null,
        phone: null,
        upCount: 0,
        downCount: 0,
        pickupCount: 7,
        deliveryCount: 0,
        loadCount: 0,
        total: '$4,498',
        thumbUp: null,
        thumbDown: null,
        latestComment: null,
        status: 1,
        doc: {
          email: '',
          phone: '(601) 732-8670',
          address: {
            city: 'Morton',
            state: 'Mississippi',
            address: '4013 US-80, Morton, MS 39117, USA',
            country: 'US',
            zipCode: '39117',
            streetName: 'U.S. 80',
            streetNumber: '4013',
            stateShortName: 'MS',
          },
          addressUnit: '',
          appointments: 1,
          contactPersons: [],
          receivingHours: '',
        },
        protected: null,
        createdAt: null,
        updatedAt: null,
        guid: '6628a080-baed-4a85-8933-ed656785957b',
        textDbaName: '',
        textPhone: '(601) 732-8670',
        textEmail: '',
        textAddress: '4013 US-80, Morton, MS 39117, USA',
      },
    ];

    let data: any[] = [];

    for (let i = 0; i < numberOfCopy; i++) {
      if (dataType === 'broker') {
        data.push(dataBroker[0]);
      } else {
        data.push(dataShippers[0]);
      }
    }

    return data;
  }

  public onTableBodyActions(event: any) {
    if (this.selectedTab === 'broker') {
      this.modalService.openModal(
        BrokerModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
          dnuButton: true,
          bfbButton: true
        }
      );
    } else {
      //TODO: SHIPPER
    }
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      console.log(this.selectedTab);

      if (this.selectedTab === 'broker') {
        this.modalService.openModal(BrokerModalComponent, { size: 'small' });
      } else {
        //TODO: SHIPPER
      }
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setCustomerData(event.tabData);
    }
  }
}
