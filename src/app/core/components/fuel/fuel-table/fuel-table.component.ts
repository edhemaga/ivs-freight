import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getAccountingFuelColumnDefinition } from 'src/assets/utils/settings/accounting-fuel-columns';
import { FuelPurchaseModalComponent } from '../../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';

import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-fuel-table',
  templateUrl: './fuel-table.component.html',
  styleUrls: ['./fuel-table.component.scss'],
})
export class FuelTableComponent implements OnInit {
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
    this.getFuelData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendFuelData();
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
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'fuel',
          text: 'Are you sure you want to delete fuel(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getFuelData() {
    this.sendFuelData();
  }

  sendFuelData() {
    this.tableData = [
      {
        title: 'Fuel',
        field: 'active',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        hideLength: false,
        gridNameTitle: 'Fuel',
        selectTab: true,
        stateName: 'fuels',
        gridColumns: this.getGridColumns('fuel', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setFuelData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getAccountingFuelColumnDefinition();
    }
  }

  setFuelData(td: any) {
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
        api: 1,
        apiTransactionId: 979637489,
        avatar:
          'data:image/png;base64,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',
        companyId: 1,
        companyName: null,
        createdAt: '2022-03-24T00:10:11',
        doc: null,
        driverFullName: 'Jamarcus Cobb',
        driverId: 406,
        fuelItems: [
          {
            categoryId: 911,
            category: 'Refeer',
            qty: 29.18,
            unit: null,
            price: 4.81,
            subtotal: 140.41,
          },
          {
            categoryId: 907,
            category: 'Diesel',
            qty: 48.09,
            unit: null,
            price: 4.81,
            subtotal: 231.4,
          },
        ],
        guid: 'b5821a68-4673-4540-8c1f-de64025568a7',
        id: 2683,
        items: 'Refeer<div class="description-dot"></div>Diesel',
        invoice: '0091585',
        location: 'SANFORD, NC',
        longitude: -79.2168734,
        name: 'CIRCLE K #2723778',
        supplierId: 106235,
        supplierName: null,
        timezoneOffset: -5,
        cardNumber: '7083052138884300041',
        transactionDate: '03/23/22',
        transactionTime: '10:49 PM',
        truckId: 200,
        truckNumber: '1419',
        updatedAt: '2022-03-24T00:10:11',
        qty: '77.27',
        total: 371.81,
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[0]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(FuelPurchaseModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setFuelData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        FuelPurchaseModalComponent,
        { size: 'small' },
        {
          ...event,
        }
      );
    }
  }
}
