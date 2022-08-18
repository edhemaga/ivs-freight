import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetCompanyContactListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { getToolsContactsColumnDefinition } from 'src/assets/utils/settings/contacts-columns';
import { ContactModalComponent } from '../../modals/contact-modal/contact-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ContactQuery } from '../state/contact-state/contact.query';
import { ContactState } from '../state/contact-state/contact.store';
import { ContactTService } from '../state/contact.service';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.scss'],
})
export class ContactsTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  contacts: ContactState[] = [];
  backFilterQuery = {
    labelId: undefined,
    pageIndex: 1,
    pageSize: 25,
    companyId: undefined,
    sort: undefined,
    searchOne: undefined,
    searchTwo: undefined,
    searchThree: undefined,
  };

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private contactQuery: ContactQuery,
    private contactService: ContactTService
  ) {}

  ngOnInit(): void {
    this.sendContactData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendContactData();
        }
      });

    // Resize
    this.tableService.currentColumnWidth
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.event?.width) {
          this.columns = this.columns.map((c) => {
            if (c.title === response.columns[response.event.index].title) {
              c.width = response.event.width;
            }

            return c;
          });
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.column) {
          this.columns = this.columns.map((c) => {
            if (c.field === response.column.field) {
              c.hidden = response.column.hidden;
            }

            return c;
          });
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.contactBackFilter(searchEvent.query);
            } else if (searchEvent.action === 'store') {
              this.sendContactData();
            }
          }
        }
      });

    // Contact Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // Add Contact
        if (res.animation === 'add') {
          this.viewData.push(this.mapContactData(res.data));

          this.viewData = this.viewData.map((contact: any) => {
            if (contact.id === res.id) {
              contact.actionAnimation = 'add';
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);

          this.updateDataCount();
        }
        // Update Contact
        else if (res.animation === 'update') {
          const updatedContact = this.mapContactData(res.data);

          this.viewData = this.viewData.map((contact: any) => {
            if (contact.id === res.id) {
              contact = updatedContact;
              contact.actionAnimation = 'update';
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // Delete Contact
        else if (res.animation === 'delete') {
          let contactIndex: number;

          this.viewData = this.viewData.map((contact: any, index: number) => {
            if (contact.id === res.id) {
              contact.actionAnimation = 'delete';
              contact = index;
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(contactIndex, 1);
            clearInterval(inetval);
          }, 1000);

          this.updateDataCount();
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.contactService
            .deleteAccountList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.viewData = this.viewData.map((contact: any) => {
                response.map((r: any) => {
                  if (contact.id === r.id) {
                    contact.actionAnimation = 'delete';
                  }
                });

                return contact;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observTableContainer();
    }, 10);
  }

  // Responsive Observer
  observTableContainer() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.tableContainerWidth = entry.contentRect.width;
      });
    });

    this.resizeObserver.observe(document.querySelector('.table-container'));
  }

  // Table Options
  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        viewModeActive: 'List',
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

  // Send Contact Data
  sendContactData() {
    this.initTableOptions();

    const contactCount = JSON.parse(localStorage.getItem('contactTableCount'));

    const contactData = this.getTabData();

    this.tableData = [
      {
        title: 'Contacts',
        field: 'active',
        length: contactCount.contact,
        data: contactData,
        extended: false,
        gridNameTitle: 'Contact',
        stateName: 'contacts',
        gridColumns: this.getGridColumns('contacts', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setContactData(td);
  }

  // Get Contact Data From Store Or Via Api Call
  getTabData() {
    this.contacts = this.contactQuery.getAll();

    return this.contacts?.length ? this.contacts : [];
  }

  // Update Contact Count
  updateDataCount() {
    const contactCount = JSON.parse(localStorage.getItem('contactTableCount'));

    this.tableData[0].length = contactCount.contact;
  }

  // Get Columns Definition
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

  // Set Countact Data
  setContactData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any) => {
        return this.mapContactData(data);
      });

      console.log('Contact Data');
      console.log(this.viewData);

      // For Testing
      // for (let i = 0; i < 300; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  // Map Contact Data
  mapContactData(data: any) {
    return {
      ...data,
      isSelected: false,
      textAddress: data?.address?.address ? data.address.address : '',
      labelName: data?.companyContactLabel ? data.companyContactLabel : {},
    };
  }

  // Contact Back Filter
  contactBackFilter(filter: {
    labelId: number | undefined;
    pageIndex: number;
    pageSize: number;
    companyId: number | undefined;
    sort: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
  }) {
    this.contactService
      .getContacts(
        filter.labelId,
        filter.pageIndex,
        filter.pageSize,
        filter.companyId,
        filter.sort,
        filter.searchOne,
        filter.searchTwo,
        filter.searchThree
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((contact: GetCompanyContactListResponse) => {
        this.viewData = contact.pagination.data;

        this.viewData = this.viewData.map((data: any) => {
          return this.mapContactData(data);
        });
      });
  }

  // On Toolbar Actions
  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(ContactModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setContactData(event.tabData);
    }
  }

  // On Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.sort = event.direction;

        this.contactBackFilter(this.backFilterQuery);
      } else {
        this.sendContactData();
      }
    }
  }

  // On Body Actions
  onTableBodyActions(event: any) {
    console.log(event);
    if (event.type === 'edit-contact') {
      this.modalService.openModal(
        ContactModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
        }
      );
    } else if (event.type === 'delete-contact') {
      this.contactService
        .deleteCompanyContactById(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
