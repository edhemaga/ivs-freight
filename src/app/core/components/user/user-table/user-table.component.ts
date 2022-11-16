import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getUsersColumnDefinition } from 'src/assets/utils/settings/users-columns';
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { UserQuery } from '../state/user-state/user.query';
import { UserState } from '../state/user-state/user.store';
import { formatPhonePipe } from 'src/app/core/pipes/formatPhone.pipe';
import { NameInitialsPipe } from 'src/app/core/pipes/nameinitials';

@Component({
   selector: 'app-user-table',
   templateUrl: './user-table.component.html',
   styleUrls: ['./user-table.component.scss'],
   providers: [formatPhonePipe, NameInitialsPipe],
})
export class UserTableComponent implements OnInit, AfterViewInit, OnDestroy {
   private destroy$ = new Subject<void>();

   tableOptions: any = {};
   tableData: any[] = [];
   viewData: any[] = [];
   columns: any[] = [];
   selectedTab = 'active';
   activeViewMode: string = 'List';
   tableContainerWidth: number = 0;
   resizeObserver: ResizeObserver;
   mapingIndex: number = 0;
   users: UserState[] = [];

   constructor(
      private modalService: ModalService,
      private tableService: TruckassistTableService,
      private userQuery: UserQuery,
      private phoneFormater: formatPhonePipe,
      private nameInitialsPipe: NameInitialsPipe
   ) {}

   // ---------------------------  NgOnInit ----------------------------------
   ngOnInit(): void {
      this.sendUserData();

      // Reset Columns
      this.tableService.currentResetColumns
         .pipe(takeUntil(this.destroy$))
         .subscribe((response: boolean) => {
            if (response) {
               this.sendUserData();
            }
         });

      // Resize
      this.tableService.currentColumnWidth
         .pipe(takeUntil(this.destroy$))
         .subscribe((response: any) => {
            if (response?.event?.width) {
               this.columns = this.columns.map((c) => {
                  if (
                     c.title === response.columns[response.event.index].title
                  ) {
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
          }, 2300);

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
          }, 900);

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
                    contact.actionAnimation = 'delete-multiple';
                  }
                });

                return contact;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 900);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        } */
         });
   }

   // ---------------------------  NgAfterViewInit ----------------------------------
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
   initTableOptions(): void {
      this.tableOptions = {
         toolbarActions: {
            viewModeOptions: [
               { name: 'List', active: this.activeViewMode === 'List' },
               { name: 'Card', active: this.activeViewMode === 'Card' },
            ],
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
      };
   }

   // Get Columns Definition
   getGridColumns(configType: string) {
      const tableColumnsConfig = JSON.parse(
         localStorage.getItem(`table-${configType}-Configuration`)
      );

      return tableColumnsConfig
         ? tableColumnsConfig
         : getUsersColumnDefinition();
   }

   // Send User Data
   sendUserData() {
      this.initTableOptions();

      const userCount = JSON.parse(localStorage.getItem('userTableCount'));

      const userData = this.getTabData();

      this.tableData = [
         {
            title: 'User',
            field: 'active',
            length: userCount.users,
            data: userData,
            gridNameTitle: 'User',
            stateName: 'users',
            tableConfiguration: 'USER',
            isActive: true,
            gridColumns: this.getGridColumns('USER'),
         },
      ];

      const td = this.tableData.find((t) => t.field === this.selectedTab);

      this.setUserData(td);
   }

   // Get Tab Data
   getTabData() {
      this.users = this.userQuery.getAll();

      return this.users?.length ? this.users : [];
   }

   // Set User Data
   setUserData(td: any) {
      this.columns = td.gridColumns;

      if (td.data.length) {
         this.viewData = td.data;

         this.viewData = this.viewData.map((data: any) => {
            return this.mapUserData(data);
         });

         // For Testing
         // for (let i = 0; i < 300; i++) {
         //   this.viewData.push(this.viewData[0]);
         // }
      } else {
         this.viewData = [];
      }
   }

   // Map User Data
   mapUserData(data: any, dontMapIndex?: boolean) {
      if (!data?.avatar && !dontMapIndex) {
         this.mapingIndex++;
      }

      return {
         ...data,
         isSelected: false,
         userAvatar: {
            name:
               data?.firstName && data?.lastName
                  ? data.firstName + ' ' + data.lastName
                  : '',
            avatar: data?.avatar ? data.avatar : '',
            avatarColor: this.getAvatarColors(),
            textShortName: this.nameInitialsPipe.transform(
               data?.firstName && data?.lastName
                  ? data.firstName + ' ' + data.lastName
                  : ''
            ),
         },
         userTableDept: data?.department?.name ? data.department.name : '',
         userTableOffice: 'Nije spojeno',
         userTablePhone: data?.phone
            ? this.phoneFormater.transform(data.phone)
            : '',
         uesrTableExt: 'Nije povezano',
         userTableHired: 'Nije povezano',
         userTablePersonalPH: data?.personalPhone
            ? this.phoneFormater.transform(data.personalPhone)
            : '',
         userTableStatus: {
            status: data?.userType?.name ? data.userType.name : '',
            isInvited: false,
         },
         userTableCommission: data?.commission ? data.commission : '',
         userTableSalary: data?.salary ? data.salary : '',
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

   // On ToolBar Actions
   onToolBarAction(event: any) {
      if (event.action === 'open-modal') {
         this.modalService.openModal(UserModalComponent, {
            size: 'small',
         });
      } else if (event.action === 'view-mode') {
         this.activeViewMode = event.mode;
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
         this.modalService.openModal(
            UserModalComponent,
            { size: 'small' },
            {
               ...event,
               type: 'edit',
            }
         );
      }
   }

   // ---------------------------  NgOnDestroy ----------------------------------
   ngOnDestroy(): void {
      this.tableService.sendActionAnimation({});
      this.resizeObserver.unobserve(document.querySelector('.table-container'));
      this.resizeObserver.disconnect();
      this.destroy$.next();
      this.destroy$.complete();
   }
}
