import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getToolsContactsColumnDefinition } from 'src/assets/utils/settings/contacts-columns';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.scss'],
})
export class ContactsTableComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService, private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getContactData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendContactData();
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
          name: 'edit-contact',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          type: 'contact',
          name: 'delete-contact',
          text: 'Are you sure you want to delete contact(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getContactData() {
    this.sendContactData();
  }

  sendContactData() {
    this.tableData = [
      {
        title: 'Contacts',
        field: 'active',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Contact',
        stateName: 'contacts',
        gridColumns: this.getGridColumns('contacts', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setContactData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getToolsContactsColumnDefinition();
    }
  }

  setContactData(td: any) {
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
        id: 95,
        companyId: 1,
        contactType: 'both',
        name: 'Advokat Doug',
        labelId: 1144,
        labelName: '2552525',
        labelColor: '#FFAA00',
        phone: null,
        email: null,
        address: null,
        addressUnit: null,
        note: null,
        doc: {
          note: '',
          email: 'testets@gmail.com',
          phone: '(847) 241-2074',
          address: 'New York, NY, USA',
          address_unit: '',
        },
        createdAt: '2022-01-10T17:00:13',
        updatedAt: '2022-03-24T13:28:49',
        textPhone: '(847) 241-2074',
        textEmail: 'testets@gmail.com',
        textAddress: 'New York, NY, USA',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se odradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setContactData(event.tabData);
    }
  }
}
