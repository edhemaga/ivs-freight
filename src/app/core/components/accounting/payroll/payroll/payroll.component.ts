import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit, AfterViewInit {

  tableOptions: any = {};

  selectedTab = 'open';
  activeViewMode: string = 'List';
  tableData: any[] = [];
  columns: any[] = [];
  tableContainerWidth: number = 0;
  viewData: any[] = [];
  resizeObserver: ResizeObserver;
  
  constructor() {
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

  ngOnInit(): void {

    this.initTableOptions();

    this.tableData = [
      {
        title: 'Open',
        field: 'open',
        length: 0,
        data: [],
        extended: true,
        gridNameTitle: 'Payroll',
        stateName: 'open',
        tableConfiguration: 'APPLICANT',
        isActive: this.selectedTab === 'open',
        gridColumns: [],
      },
      {
        title: 'Closed',
        field: 'closed',
        length: 0,
        data: [],
        extended: false,
        gridNameTitle: 'Payroll',
        stateName: 'closed',
        tableConfiguration: 'DRIVER',
        isActive: this.selectedTab === 'closed',
        gridColumns: [],
      }
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setDriverData(td);
  }

  setDriverData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      // this.viewData = td.data;

      // this.viewData = this.viewData.map((data: any, index: number) => {
      //   return this.selectedTab === 'applicants'
      //     ? this.mapApplicantsData(data, index)
      //     : this.mapDriverData(data);
      // });

      // For Testing
      // if (this.selectedTab !== 'applicants') {
      //   for (let i = 0; i < 1000; i++) {
      //     this.viewData.push(this.viewData[0]);
      //   }
      // }
    } else {
      this.viewData = [];
    }
  }

  public summaryControll() {
  }

  onToolBarAction(event: any) {}

  initTableOptions(): void {
    this.tableOptions = {
      toolbarActions: {
        showMoneyFilter: true,
        hideOpenModalButton: true
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
            title: this.selectedTab === 'inactive' ? 'Activate' : 'Deactivate',
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

}
