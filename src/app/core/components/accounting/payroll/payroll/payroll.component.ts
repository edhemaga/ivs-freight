import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { NameInitialsPipe } from 'src/app/core/pipes/nameinitials';
import { getPayrollDriverMilesDefinition } from 'src/assets/utils/settings/payroll-columns';
import { DriversActiveQuery } from '../../../driver/state/driver-active-state/driver-active.query';
import { DriversActiveState } from '../../../driver/state/driver-active-state/driver-active.store';
import { DriversInactiveQuery } from '../../../driver/state/driver-inactive-state/driver-inactive.query';
import { DriversInactiveState } from '../../../driver/state/driver-inactive-state/driver-inactive.store';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [NameInitialsPipe]
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

  driversActive: DriversActiveState[] = [];
  driversInactive: DriversInactiveState[] = [];
  mapingIndex: number = 0;

  constructor(
    private driversActiveQuery: DriversActiveQuery,
    private driversInactiveQuery: DriversInactiveQuery,
    private nameInitialsPipe: NameInitialsPipe,
  ) {}

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

    console.log("tableContainerWidth", this.tableContainerWidth);

    this.resizeObserver.observe(document.querySelector('.table-container'));
  }

  ngOnInit(): void {
    this.initTableOptions();

    const driverCount = JSON.parse(localStorage.getItem('driverTableCount'));

    const applicantsData = this.getTabData(null);

    const driverActiveData =
      this.selectedTab === 'open' ? this.getTabData('active') : [];

    const driverInactiveData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    this.tableData = [
      {
        title: 'Open',
        field: 'open',
        length: 0,
        data: driverActiveData,
        extended: true,
        gridNameTitle: 'Payroll',
        stateName: 'open',
        tableConfiguration: 'APPLICANT',
        isActive: this.selectedTab === 'open',
        gridColumns: getPayrollDriverMilesDefinition(),
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
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setDriverData(td);
  }

  setDriverData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;
      this.viewData = this.viewData.map((data: any, index: number) => {
        return this.selectedTab === 'open'
          ? this.mapApplicantsData(data, index)
          : this.mapApplicantsData(data, index);
      });
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

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.driversActive = this.driversActiveQuery.getAll();

      console.log("WHAT IS FINDING DATA");
      console.log(this.driversActive);
      return this.driversActive?.length ? this.driversActive : [];
    } else if (dataType === 'inactive') {
      this.driversInactive = this.driversInactiveQuery.getAll();

      return this.driversInactive?.length ? this.driversInactive : [];
    } else {
      let mockData = [];

      for (let i = 0; i < 10; i++) {
        mockData.push({});
      }

      return mockData;
    }
  }

  public summaryControll() {}

  onToolBarAction(event: any) {}

  initTableOptions(): void {
    this.tableOptions = {
      toolbarActions: {
        showMoneyFilter: true,
        hideOpenModalButton: true,
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

  mapApplicantsData(data: any, index: number) {
    return {
      fullName: 'Angelo Trotter',
      payroll: 'LA59OSK',
      period: '04/04/44',
      total: '2,300.2',
      empty: '500',
      salary: "2,300.2",
      loaded: '1,500.2',
      "MI Pay": "$1,842.06",
      dob: '04/04/44',
      textShortName: this.nameInitialsPipe.transform('Angelo Trotter'),
      avatarColor: this.getAvatarColors(),
      status: "444 DAYS",
      email: 'angelo.T@gmail.com',
      applicantProgress: [
        {
          title: 'App.',
          status: 'Done',
          width: 34,
          class: 'complete-icon',
          percentage: 34,
        },
        {
          title: 'Mvr',
          status: 'In Progres',
          width: 34,
          class: 'complete-icon',
          percentage: 34,
        },
        {
          title: 'Psp',
          status: 'Wrong',
          width: 29,
          class: 'wrong-icon',
          percentage: 34,
        },
        {
          title: 'Sph',
          status: 'No Started',
          width: 30,
          class: 'complete-icon',
          percentage: 34,
        },
        {
          title: 'Hos',
          status: 'Done',
          width: 32,
          class: 'done-icon',
          percentage: 34,
        },
        {
          title: 'Ssn',
          status: 'Done',
          width: 29,
          class: 'wrong-icon',
          percentage: 34,
        },
      ],
      // Complete, Done, Wrong, In Progres, Not Started
      medical: {
        class:
          index === 0
            ? 'complete-icon'
            : index === 1
            ? 'done-icon'
            : index === 2
            ? 'wrong-icon'
            : '',
        hideProgres: index !== 3,
        isApplicant: true,
        expirationDays: '3233',
        percentage: 34,
      },
      cdl: {
        class:
          index === 0
            ? 'complete-icon'
            : index === 1
            ? 'done-icon'
            : index === 2
            ? 'wrong-icon'
            : '',
        hideProgres: index !== 3,
        isApplicant: true,
        expirationDays: "22",
        percentage: 10,
      },
      rev: {
        title:
          index === 0
            ? 'Reviewed'
            : index === 1
            ? 'Finished'
            : index === 2
            ? 'Incomplete'
            : 'Ready',
        iconLink:
          index === 0 || index === 2
            ? '../../../../../assets/svg/truckassist-table/applicant-wrong-icon.svg'
            : '../../../../../assets/svg/truckassist-table/applicant-done-icon.svg',
      },
      hire: true,
      favorite: false,
    };
  }
  // Get Avatar Color
  getAvatarColors() {
    let textColors: string[] = [
      '#6D82C7',
      '#4DB6A2',
      '#E57373',
      '#E3B00F',
      '#BA68C8',
      '#BEAB80',
      '#81C784',
      '#FF8A65',
      '#64B5F6',
      '#F26EC2',
      '#A1887F',
      '#919191',
    ];

    let backgroundColors: string[] = [
      '#DAE0F1',
      '#D2EDE8',
      '#F9DCDC',
      '#F8EBC2',
      '#EED9F1',
      '#EFEADF',
      '#DFF1E0',
      '#FFE2D8',
      '#D8ECFD',
      '#FCDAF0',
      '#E7E1DF',
      '#E3E3E3',
    ];

    this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

    return {
      background: backgroundColors[this.mapingIndex],
      color: textColors[this.mapingIndex],
    };
  }

  getGridColumns(activeTab: string, configType: string) {
    // const tableColumnsConfig = JSON.parse(
    //   localStorage.getItem(`table-${configType}-Configuration`)
    // );
    // switch(activeTab){
    // }
    // if (activeTab === 'applicants') {
    //   return tableColumnsConfig
    //     ? tableColumnsConfig
    //     : getApplicantColumnsDefinition();
    // }
  }
}
