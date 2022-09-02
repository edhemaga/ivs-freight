import { Component, OnInit } from '@angular/core';
import { ModalService } from '../shared/ta-modal/modal.service';

import { RepairPmModalComponent } from '../modals/repair-modals/repair-pm-modal/repair-pm-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../services/truckassist-table/truckassist-table.service';
import {
  getTruckPMColumnDefinition,
  getTrailerPMColumnDefinition,
} from '../../../../assets/utils/settings/pm-columns';

@Component({
  selector: 'app-pm-truck-trailer',
  templateUrl: './pm-truck-trailer.component.html',
  styleUrls: ['./pm-truck-trailer.component.scss'],
})
export class PmTruckTrailerComponent implements OnInit {
  private destroy$ = new Subject<void>();
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
    this.sendPMData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendPMData();
        }
      });
  }

  initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        viewModeActive: 'List',
        showGeneralPmBtn: true,
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
          text: 'Are you sure you want to delete pm(s)',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendPMData() {
    this.tableData = [
      {
        title: 'Truck',
        field: 'active',
        length: 8,
        data: this.getDumyData(8, 'truck'),
        extended: false,
        selectTab: true,
        gridNameTitle: 'PM',
        stateName: 'pm_trucks',
        gridColumns: this.getGridColumns('pm_trucks', this.resetColumns),
      },
      {
        title: 'Trailer',
        field: 'inactive',
        length: 15,
        data: this.getDumyData(15, 'trailer'),
        extended: false,
        selectTab: true,
        gridNameTitle: 'PM',
        stateName: 'pm_trailers',
        gridColumns: this.getGridColumns('pm_trailers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setRepairData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'pm_trucks') {
        return getTruckPMColumnDefinition();
      } else {
        return getTrailerPMColumnDefinition();
      }
    }
  }

  setRepairData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getDumyData(numberOfCopy: number, dataType: string) {
    const truck = {
      textUnit: '12345',
      textOdometear: '567,364',
      oilFilter: {
        start: new Date(),
        end: null,
      },
      airFilter: {
        start: new Date(),
        end: null,
      },
      transFluid: {
        start: new Date(),
        end: null,
      },
      belts: {
        start: new Date(),
        end: null,
      },
      engTuneUp: {
        start: new Date(),
        end: null,
      },
      alignment: {
        start: new Date(),
        end: null,
      },
      textInv: 'W444-444',
      textLastShop: 'NEXTRAN TRUCKS',
      lastService: '04/04/24',
    };

    const trailer = {
      textUnit: '123',
      textOdometer: '1,267,305',
      lastServe: '01/29/21',
      repairShop: 'ARMEN’S TIRE AND SERVICE',
      color: '#7040A1',
      svgIcon: 'Treba da se sredi',
      reeferUnit: {
        start: new Date(),
        end: null,
      },
      ruMake: 'Carrier',
      reventiveMaintenance: {
        start: new Date(),
        end: null,
      },
    };

    let data = [];

    for (let i = 0; i < numberOfCopy; i++) {
      if (dataType === 'truck') {
        data.push(truck);
      } else {
        data.push(trailer);
      }
    }

    return data;
  }

  onToolBarAction(event: any) {
    switch (event.action) {
      case 'tab-selected': {
        this.selectedTab = event.tabData.field;
        this.sendPMData();
        break;
      }
      case 'open-general-pm': {
        switch (this.selectedTab) {
          case 'active': {
            this.modalService.openModal(
              RepairPmModalComponent,
              { size: 'small' },
              {
                type: 'new',
                header: 'Truck',
                action: 'generic-pm',
              }
            );
            break;
          }
          case 'inactive': {
            this.modalService.openModal(
              RepairPmModalComponent,
              { size: 'small' },
              {
                type: 'new',
                header: 'Trailer',
                action: 'generic-pm',
              }
            );
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onTableBodyActions(event: any) {
    switch (this.selectedTab) {
      case 'active': {
        this.modalService.openModal(
          RepairPmModalComponent,
          { size: 'small' },
          {
            ...event,
            header: 'Truck',
            action: 'unit-pm',
          }
        );
        break;
      }
      case 'inactive': {
        this.modalService.openModal(
          RepairPmModalComponent,
          { size: 'small' },
          {
            ...event,
            header: 'Trailer',
            action: 'unit-pm',
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
