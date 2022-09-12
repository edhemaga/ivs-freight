import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getUsersColumnDefinition } from 'src/assets/utils/settings/users-columns';
import { UserModalComponent } from '../../../modals/user-modal/user-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.sendUserData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendUserData();
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
       /*  if (res) {
          this.mapingIndex = 0;

          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.contactBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendContactData();
            }
          }
        } */
      });

    // User Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // Add User
        if (res.animation === 'add') {
         /*  this.viewData.push(this.mapContactData(res.data));

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

          this.updateDataCount(); */
        }
        // Update USer
        else if (res.animation === 'update') {
          /* const updatedContact = this.mapContactData(res.data, true);

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
          }, 1000); */
        }
        // Delete User
        else if (res.animation === 'delete') {
          /* let contactIndex: number;

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

          this.updateDataCount(); */
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        /* if (response.length) {
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
        } */
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

  initTableOptions(): void {
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
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Reset Password',
          name: 'reset-password',
          class: 'regular-text',
          contentType: 'reset',
        },
        {
          title: 'Deactivate',
          name: 'deactivate',
          class: 'regular-text',
          contentType: 'activate',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'users',
          text: 'Are you sure you want to delete user(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendUserData() {
    this.initTableOptions();

    this.tableData = [
      {
        title: 'Company',
        field: 'route',
        length: 0,
        hideDataCount: true,
        iconLink: '../../../../../../assets/svg/common/ic_company.svg',
        routeNavigate: '/settings/company',
        data: [],
        gridNameTitle: 'Settings',
        stateName: 'company',
        gridColumns: [],
      },
      {
        title: 'Location',
        field: 'route',
        length: 0,
        iconLink: '../../../../../../assets/svg/common/ic_location.svg',
        data: [],
        routeNavigate: '/settings/location',
        gridNameTitle: 'Settings',
        stateName: 'location',
        gridColumns: [],
      },
      {
        title: 'Document',
        field: 'route',
        length: 0,
        iconLink: '../../../../../../assets/svg/common/ic_document.svg',
        data: [],
        gridNameTitle: 'Settings',
        routeNavigate: '/settings/document',
        stateName: 'document',
        gridColumns: [],
      },
      {
        title: 'User',
        field: 'active',
        length: 10,
        iconLink: '../../../../../../assets/svg/common/ic_user.svg',
        data: this.getDumyData(10),
        gridNameTitle: 'Settings',
        stateName: 'users',
        gridColumns: this.getGridColumns('users', this.resetColumns),
      },
      {
        title: 'Biling',
        field: 'route',
        length: 0,
        iconLink: '../../../../../../assets/svg/common/ic_billing.svg',
        data: [],
        routeNavigate: '/settings/billing',
        gridNameTitle: 'Settings',
        stateName: 'biling',
        gridColumns: [],
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setUserData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
   /*  const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    ); */

    return getUsersColumnDefinition();
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

  // On ToolBar Actions
  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(UserModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected' && event.tabData.routeNavigate) {

      this.router.navigate([event.tabData.routeNavigate]);
    }
  }

  // On Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
       /*  this.mapingIndex = 0;

        this.backFilterQuery.sort = event.direction;

        this.backFilterQuery.pageIndex = 1;

        this.contactBackFilter(this.backFilterQuery); */
      } else {
        this.sendUserData();
      }
    }
  }

  // On Body Actions
  onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(UserModalComponent, { size: 'small' });
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
