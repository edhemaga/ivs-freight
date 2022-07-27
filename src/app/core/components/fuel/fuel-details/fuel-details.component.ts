import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fuel-details',
  templateUrl: './fuel-details.component.html',
  styleUrls: ['./fuel-details.component.scss'],
})
export class FuelDetailsComponent implements OnInit {
  public fuelConfig: any[] = [];
  public fuelDrop: any;
  constructor() {}

  ngOnInit(): void {
    this.fuelConf();
    this.initTableOptions();
  }
  /**Function for dots in cards */
  public initTableOptions(): void {
    this.fuelDrop = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        // {
        //   title: 'Send Message',
        //   name: 'dm',
        //   class: 'regular-text',
        //   contentType: 'dm',
        // },
        // {
        //   title: 'Print',
        //   name: 'print',
        //   class: 'regular-text',
        //   contentType: 'print',
        // },
        // {
        //   title: 'Deactivate',
        //   name: 'deactivate',
        //   class: 'regular-text',
        //   contentType: 'deactivate',
        // },
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  fuelConf() {
    this.fuelConfig = [
      {
        id: 0,
        name: 'Fuel Stop Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Transaction',
        template: 'transaction',
        icon: true,
        data: 25,
        customText: 'Date',
        status: false,
        icons: [
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_search.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_clock.svg',
          },

          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_funnel.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_dollar.svg',
          },
        ],
      },
      {
        id: 2,
        name: 'Fuelled Vehicle',
        template: 'fuel-vehicle',
        data: 18,
        hide: true,
        status: true,
        customText: 'Cost',
      },
    ];
  }
}
