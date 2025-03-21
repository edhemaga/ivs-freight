import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { ContactsDropdownMenuActionsBase } from '@pages/contacts/base-classes';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';
import { ContactsService } from '@shared/services/contacts.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { ContactStoreService } from '@pages/contacts/services/contact-store.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { getToolsContactsColumnDefinition } from '@shared/utils/settings/table-settings/contacts-columns';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eDropdownMenu, eCommonElement, eActiveViewMode } from '@shared/enums';

// constants
import { ContactsCardData } from '@pages/contacts/utils/constants/contacts-card-data.constants';

// models
import { ContactsTableToolbarAction } from '@pages/contacts/pages/contacts-table/models/contacts-table-toolbar-action.model';
import { IContactsTableHeadAction } from '@pages/contacts/pages/contacts-table/interfaces/contacts-table-head-action.interface';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

@Component({
    selector: 'app-contacts-table',
    templateUrl: './contacts-table.component.html',
    styleUrls: ['./contacts-table.component.scss'],
    providers: [NameInitialsPipe],
})
export class ContactsTableComponent
    extends ContactsDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public eDropdownMenu = eDropdownMenu;

    public resizeObserver: ResizeObserver;

    public selectedTab: string = TableStringEnum.ACTIVE;

    // table
    public viewData: any[] = [];

    // cards
    public sendDataToCardsFront: CardRows[] =
        ContactsCardData.displayRowsFrontContacts;
    public sendDataToCardsBack: CardRows[] =
        ContactsCardData.displayRowsBackContacts;

    public eCommonElement = eCommonElement;

    // filters
    public filter = {
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
        // services
        protected modalService: ModalService,
        protected contactsService: ContactsService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private confirmationService: ConfirmationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        protected contactStoreService: ContactStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.manageSubscriptions();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private manageSubscriptions(): void {
        this.contactResetColumns();

        this.contactResize();

        this.confirmationSubscribe();

        this.contactCurrentToaggleColumn();

        this.contactCurrentSearchTableData();

        this.contactCurrentDeleteSelectedRows();
    }

    private contactResetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.contactStoreService.dispatchTableColumnReset();
                }
            });
    }

    private contactResize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                const { event, columns } = response || {};
                const { width, index } = event || {};

                if (width)
                    this.contactStoreService.dispatchTableColumnResize(
                        columns,
                        width,
                        index
                    );
            });
    }

    private contactCurrentToaggleColumn(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((toggledColumn) => {
                this.contactStoreService.dispatchTableColumnToggled(
                    toggledColumn
                );
            });
    }

    private contactCurrentSearchTableData(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.filter = {
                        ...this.filter,
                        pageIndex: 1,
                    };

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.filter
                    );

                    if (searchEvent) {
                        this.contactStoreService.dispatchGetContactList(
                            this.filter
                        );
                    }
                }
            });
    }

    private contactCurrentDeleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.CONTACT,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            this.contactStoreService.dispatchDeleteContactById(
                                res.id
                            );

                            break;
                        case TableStringEnum.MULTIPLE_DELETE:
                            this.contactStoreService.dispatchDeleteBulkContact(
                                res.array
                            );

                            break;
                        default:
                            break;
                    }
                },
            });
    }

    public observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver?.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    public getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getToolsContactsColumnDefinition();
    }

    public getContactDropdownContent(): IDropdownMenuItem[] {
        return DropdownMenuContentHelper.getContactDropdownContent();
    }

    public onToolBarAction(event: ContactsTableToolbarAction) {
        const { action, mode } = event || {};
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.contactStoreService.dispatchGetCreateContactModalData();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.contactStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }

    public onTableHeadActions(event: IContactsTableHeadAction) {
        if (event.action === TableStringEnum.SORT) {
            const { direction } = event || {};

            if (event.direction) {
                this.filter = {
                    ...this.filter,
                    pageIndex: 1,
                    sort: direction,
                };
            } else {
                this.filter = {
                    ...this.filter,
                    pageIndex: 1,
                    sort: undefined,
                };
            }

            this.contactStoreService.dispatchGetContactList(this.filter);
        }
    }

    public handleShowMoreAction(): void {
        this.filter = {
            ...this.filter,
            pageIndex: this.filter.pageIndex + 1,
        };

        this.contactStoreService.dispatchGetContactList(this.filter, true);
    }

    public updateToolbarDropdownMenuContent(): void {}

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
