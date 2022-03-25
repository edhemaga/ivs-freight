import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getUsersColumnDefinition } from 'src/assets/utils/settings/users-columns';

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss'],
})
export class SettingsUserComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getUserData();
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
        },
        {
          title: 'Reset Password',
          name: 'reset-password',
        },
        {
          title: 'Deactivate',
          name: 'deactivate',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'users',
          text: 'Are you sure you want to delete user(s)?',
        },
      ],
      export: true,
    };
  }

  getUserData() {
    this.sendUserData();
  }

  sendUserData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        allowSelectRow: true,
        dontShowChips: true,
        gridNameTitle: 'User',
        stateName: 'company_users',
        gridColumns: this.getGridColumns('company_users', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setUserData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getUsersColumnDefinition();
    }
  }

  setUserData(td: any) {
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
        id: 2,
        companyUserid: null,
        companyId: 1,
        userId: 2,
        baseUserTypeId: null,
        baseUserType: 'master',
        userTypeId: null,
        userType: 'Owner',
        textDept: 'Accounting',
        userStatus: 'Owner',
        textOffice: 'Main Office',
        textExt: '158',
        textComm: '6.00%',
        textSalary: '$1,750.00',
        userFullName: 'Ivan Stoiljkovic',
        dateOfBirth: null,
        email: 'ivan@ivsfreight.com',
        status: 1,
        dnu: null,
        ban: null,
        avatar: {
          id: 'af9582b5-8999-4172-88d2-4b009ab8648b',
          src: '',
        },
        doc: {
          phone: '(630) 632-7776',
          address: {
            city: 'Denver',
            state: 'Colorado',
            address: '969 Federal Blvd, Denver, CO 80204, USA',
            country: 'US',
            zipCode: '80204',
            stateShortName: 'CO',
          },
          userType: {
            id: 'admin',
            name: 'Admin',
          },
          addressUnit: '12',
        },
        dateFlag: 'registered',
        dateValue: '07/26/20',
        verifiedAt: null,
        createdAt: null,
        updatedAt: null,
        guid: 'd21e56b2-11c0-4a4d-a2cd-a5b6353aa59a',
        textPhone: '(630) 632-7776',
      },
      {
        id: 647,
        companyUserid: 70,
        companyId: 1,
        userId: 647,
        baseUserTypeId: null,
        baseUserType: 'company_user',
        userTypeId: 2,
        userType: 'Dispatcher',
        userFullName: 'Stefan Tacic',
        textDept: 'Dispatch',
        userStatus: 'Admin',
        textOffice: 'CMA Altaire Group',
        textExt: '200',
        textComm: '12.00%',
        textSalary: '$650.00',
        dateOfBirth: null,
        email: 'stefano.tacic@gmail.com',
        status: 1,
        dnu: 0,
        ban: 0,
        avatar: {
          id: 'af9582b5-8999-4172-88d2-4b009ab8648b',
          src: 'https://media.istockphoto.com/photos/close-up-young-smiling-man-in-casual-clothes-posing-isolated-on-blue-picture-id1270987867?k=20&m=1270987867&s=612x612&w=0&h=lX9Y1qUxtWOa0W0Mc-SvNta00UH0-sgJQItkxfwE4uU=',
        },
        doc: {
          phone: '',
          userType: {
            id: 'dispatcher',
            name: 'Dispatcher',
          },
          addressUnit: '',
        },
        dateFlag: 'verified',
        dateValue: '05/20/21',
        verifiedAt: null,
        createdAt: null,
        updatedAt: null,
        guid: 'd7ba3899-3eec-43fd-afb3-cc49ab9cdede',
        textPhone: '(342) 643-4565',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[1]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se odradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setUserData(event.tabData);
    }
  }
}
