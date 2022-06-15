import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  getBrokerColumnDefinition,
  getShipperColumnDefinition,
} from 'src/assets/utils/settings/customer-columns';
import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../modals/shipper-modal/shipper-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BrokerQuery } from '../state/broker-state/broker.query';
import { BrokerState } from '../state/broker-state/broker.store';

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
  public brokers: BrokerState[] = [];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private brokerQuery: BrokerQuery
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
        data: this.getBrokerShipperTabData('broker'),
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
        data: this.getBrokerShipperTabData('shipper'),
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Shipper',
        stateName: 'shippers',
        gridColumns: this.getGridColumns('shippers', this.resetColumns),
      },
    ];

    console.log('Table Data');
    console.log(this.tableData);

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

    this.viewData = this.viewData.map((data: any) => {
      return this.mapBrokerData(data);
    });

    console.log('setCustomerData')
    console.log(this.viewData)
  }

  mapBrokerData(data: any){
    return {
      ...data,
      isSelected: false
    }
  }

  getBrokerShipperTabData(dataType: string) {
    if(dataType === 'Broker'){
      this.brokers = this.brokerQuery.getAll();

      return this.brokers?.length ? this.brokers : [];
    }else{
      return [];
    }
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
      this.modalService.openModal(
        ShipperModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
        }
      );
    }
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      console.log(this.selectedTab);

      if (this.selectedTab === 'broker') {
        this.modalService.openModal(BrokerModalComponent, { size: 'medium' });
      } else { 
        this.modalService.openModal(ShipperModalComponent, { size: 'medium' });
      }
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setCustomerData(event.tabData);
    }
  }
}
