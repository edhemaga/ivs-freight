import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// scrolling
import {
    CdkVirtualScrollViewport,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

// strategy
import { TableStrategy } from '@shared/components/ta-table/ta-table-body/strategy/table-strategy';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { FilesService } from '@shared/services/files.service';
import { LoadService } from '@shared/services/load.service';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// components
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaInputDropdownContactsComponent } from '@shared/components/ta-input-dropdown-contacts/ta-input-dropdown-contacts.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { TaStatusComponentComponent } from '@shared/components/ta-status-component/ta-status-component.component';
import { TaOpenHoursDropdownComponent } from '@shared/components/ta-open-hours-dropdown/ta-open-hours-dropdown.component';
import {
    CaDropdownMenuComponent,
    CaProfileImageComponent,
    CaProgressRangeComponent,
    CaSearchMultipleStatesService,
} from 'ca-components';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    NgbModule,
    NgbPopoverModule,
    type NgbPopover,
    type NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';

// sanitizer
import { DomSanitizer } from '@angular/platform-browser';

// pipes
import { TableHighlightSearchTextPipe } from '@shared/components/ta-table/ta-table-body/pipes/table-highlight-search-text.pipe';
import { ContactPhoneEmailIconPipe } from '@shared/components/ta-table/ta-table-body/pipes/contact-phone-email-icon.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { ThousandToShortFormatPipe } from '@shared/pipes/thousand-to-short-format.pipe';
import { TableLoadStatusPipe } from '@shared/pipes/table-load-status.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

// models
import {
    CompanyAccountLabelResponse,
    SignInResponse,
    LoadListLoadStopResponse,
    LoadPossibleStatusesResponse,
} from 'appcoretruckassist';
import { TableBodyColorLabel } from '@shared/models/table-models/table-body-color-label.model';
import { TableBodyOptionActions } from '@shared/components/ta-table/ta-table-body/models/table-body-option-actions.model';
import { TableBodyColumns } from '@shared/components/ta-table/ta-table-body/models/table-body-columns.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';
import { TableCardBodyActions } from '@shared/models';

// constants
import { TaStateImageTextComponent } from '@shared/components/ta-state-image-text/ta-state-image-text.component';
import { TaTableBodyConstants } from '@shared/components/ta-table/ta-table-body/utils/constants/ta-table-body.constants';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// directive
import {
    DescriptionItemsTextCountDirective,
    PreventMultipleclicksDirective,
} from '@shared/directives/';

// svg routes
import { TableBodySvgRoutes } from '@shared/components/ta-table/ta-table-body/utils/svg-routes';

@Titles()
@Component({
    selector: 'app-ta-table-body',
    templateUrl: './ta-table-body.component.html',
    styleUrls: ['./ta-table-body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        NgbModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbPopoverModule,

        // components
        TaCustomScrollbarComponent,
        TaInputDropdownLabelComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaUploadFilesComponent,
        TaAppTooltipV2Component,
        TaProgresBarComponent,
        TaInputDropdownContactsComponent,
        TaStateImageTextComponent,
        TaPasswordAccountHiddenCharactersComponent,
        LoadStatusStringComponent,
        TaStatusComponentComponent,
        TaOpenHoursDropdownComponent,
        CaProfileImageComponent,
        CaProgressRangeComponent,
        CaDropdownMenuComponent,

        // pipes
        TableHighlightSearchTextPipe,
        ContactPhoneEmailIconPipe,
        FormatCurrencyPipe,
        ThousandToShortFormatPipe,
        TableLoadStatusPipe,

        // directives
        PreventMultipleclicksDirective,
        DescriptionItemsTextCountDirective,
    ],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useClass: TableStrategy,
        },
    ],
})
export class TaTableBodyComponent<
        T extends { id: number } & TableBodyColorLabel,
    >
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();
    @ViewChild('tableScrollRef', { static: false })
    public virtualScrollViewport: CdkVirtualScrollViewport;
    public selectedContactColor: CompanyAccountLabelResponse;

    @ViewChild('tableFiles', { static: false }) public tableFiles: any;

    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    @Output() tableBodyActions: EventEmitter<TableCardBodyActions<T>> =
        new EventEmitter<TableCardBodyActions<T>>();

    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();
    public dropdownSelectionArray = new FormArray([]);

    @Input() viewData: any[];
    @Input() columns: TableBodyColumns[];
    @Input() options: TableBodyOptionActions;
    @Input() tableData: any[];
    @Input() selectedTab: string;

    public selectedContactLabel: TableBodyColorLabel[] = [];
    pinedColumns: any = [];
    pinedWidth: number = 0;
    notPinedColumns: any = [];
    actionsColumns: any = [];
    actionsWidth: number = 0;
    tableWidth: number = 0;
    mySelection: any[] = [];
    showItemDrop: number = -1;
    showScrollSectionBorder: boolean = false;
    activeTableData: any = {};
    notPinedMaxWidth: number = 0;
    dropContent: any[] = [];
    tooltip: any;
    dropDownActive: number = -1;
    progressData: any[] = [];
    viewDataEmpty: boolean;
    viewDataTimeOut: any;
    tableWidthTimeout: any;
    rowData: any;
    invoiceDropdownActive: number = -1;
    invoiceDropdownType: string = null;
    invoiceDropdownData: any;
    pageHeight: number = window.innerHeight;
    activeAttachment: number = -1;
    activeMedia: number = -1;
    activeInsurance: number = -1;
    statusTooltip: any;
    statusDropdownActive: number = -1;
    statusDropdownData: any;
    showInspectinDescriptionEdit: boolean;
    editInspectinDescriptionText: string = '';
    tableRowCounter: number = 0;
    renderInterval: any;
    dropdownActions: any;
    horizontalScrollPosition: number = 0;
    viewDataLength: number = 0;
    chipsForHighlight: string[] = [];
    public widthPopover: number = 0;

    public companyUser: SignInResponse;
    public statusDetails: LoadPossibleStatusesResponse;
    public stops: LoadListLoadStopResponse;
    public isLoading = false;
    public descriptionPopoverHeaderItems: { title: string }[] =
        TaTableBodyConstants.DESCRIPTION_POPOVER_HEADER_ITEMS;

    public isDropdownPositionBottom: boolean = false;

    public tableBodySvgRoutes = TableBodySvgRoutes;
    public taTableBodyConstants = TaTableBodyConstants;

    // Scroll Lines
    public isLeftScrollLineShown = false;
    public isRightScrollLineShown = false;
    public loadId: number;

    constructor(
        private router: Router,
        private tableService: TruckassistTableService,
        private changeDetectorRef: ChangeDetectorRef,
        private detailsDataService: DetailsDataService,
        private filesService: FilesService,
        private sanitizer: DomSanitizer,
        private loadService: LoadService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService
    ) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        // Get Selected Tab Data
        this.getSelectedTabTableData();
        this.viewDataEmpty = this.viewData.length ? false : true;

        this.viewDataLength = this.viewData.length;
        // Get Table Sections(Pined, Not Pined, Actions)
        this.getTableSections();
        this.viewData.length && this.labelDropdown();
        // Set Dropdown Content
        this.setDropContent();
        // For Rendering One By One
        this.renderOneByOne();

        // Get Table Width
        this.tableService.currentSetTableWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.getNotPinedMaxWidth();
            });

        // Select Or Deselect All
        this.tableService.currentSelectOrDeselect
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: string) => {
                if (response !== '') {
                    const isSelect = response === 'select';
                    this.mySelection = [];

                    this.viewData = this.viewData.map((data) => {
                        if (!data?.tableCantSelect) {
                            data.isSelected = isSelect;

                            if (data.isSelected) {
                                this.mySelection.push({
                                    id: data.id,
                                    tableData: data,
                                });
                            }
                        }
                        return data;
                    });

                    this.tableService.sendRowsSelected(this.mySelection);

                    this.changeDetectorRef.detectChanges();
                }
            });

        // Columns Reorder
        this.tableService.currentColumnsOrder
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response.columnsOrder) {
                    this.columns = response.columnsOrder;

                    this.getTableSections();

                    this.changeDetectorRef.detectChanges();

                    this.getNotPinedMaxWidth();
                }
            });

        // Reset Selected Columns
        this.tableService.currentResetSelectedColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((reset: boolean) => {
                if (reset) {
                    this.mySelection = [];
                }
            });

        // Chips For Highlight Search
        this.caSearchMultipleStatesService.currentChipsForHighlightSearchToTable
            .pipe(takeUntil(this.destroy$))
            .subscribe((chips: string[]) => {
                this.chipsForHighlight = chips.length ? chips : [];
            });

        this.getCompanyUser();
    }

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.viewData?.firstChange && changes?.viewData) {
            clearTimeout(this.viewDataTimeOut);
            this.viewData = [...changes.viewData.currentValue];

            this.viewDataEmpty = this.viewData.length ? false : true;

            if (!this.viewDataEmpty && changes.viewData.currentValue) {
                this.viewDataTimeOut = setTimeout(() => {
                    this.getNotPinedMaxWidth();
                    this.getSelectedTabTableData();
                }, 10);

                this.renderOneByOne();
            }

            // Reset Scroll And Elements In List
            if (
                this.showScrollSectionBorder &&
                this.viewDataLength !== this.viewData.length
            ) {
                let resetSctoll = false;

                document
                    .querySelectorAll('#table-not-pined-scroll-container')
                    .forEach((el) => {
                        if (el.scrollLeft) {
                            el.scrollLeft = 0;

                            resetSctoll = true;
                        }
                    });

                this.tableService.sendIsScrollReseting(resetSctoll);
            }

            this.viewDataLength = this.viewData.length;

            this.checkAttachmentUpdate();
        }

        if (!changes?.tableData?.firstChange && changes?.tableData) {
            this.getSelectedTabTableData();

            this.labelDropdown();
        }

        if (
            changes?.columns &&
            !changes?.columns?.firstChange &&
            changes.columns.currentValue !== changes.columns.previousValue
        ) {
            this.columns = changes.columns.currentValue;

            this.getTableSections();

            setTimeout(() => {
                this.getNotPinedMaxWidth();
            }, 10);
        }

        if (
            !changes?.selectedTab?.firstChange &&
            changes?.selectedTab?.currentValue !==
                changes?.selectedTab?.previousValue &&
            changes?.selectedTab
        ) {
            this.selectedTab = changes.selectedTab.currentValue;

            this.getSelectedTabTableData();
        }

        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;

            this.setDropContent();
        }
    }

    // --------------------------------NgAfterViewInit---------------------------------
    ngAfterViewInit(): void {
        this.getNotPinedMaxWidth();
    }
    // Render Row One By One
    renderOneByOne() {
        clearInterval(this.renderInterval);
        if (this.viewData.length - 1 <= this.tableRowCounter) {
            this.tableRowCounter = 0;
        }
        this.renderInterval = setInterval(() => {
            this.tableRowCounter++;
            this.changeDetectorRef.detectChanges();
            if (this.tableRowCounter >= this.viewData.length - 1) {
                clearInterval(this.renderInterval);
            }
        }, 1);
    }

    // Track By For Table Row
    trackTableRow(item: any) {
        return item.id;
    }
    trackTatrackStatusDetailsbleRow(item: any) {
        return item.id;
    }

    trackStops(item: any) {
        return item.id;
    }
    // Track By For Pined Columns
    trackTablePinedColumns(item: any) {
        return item.columnId;
    }

    // Track By For Not Pined Columns
    trackTableNotPinedColumns(item: any) {
        return item.columnId;
    }

    public trackByDescriptionIdentity(item: {
        title: string;
        className: string;
    }): string {
        return item.title; // Using title as the unique identifier
    }

    // Track By For Actions Columns
    trackTableActionsColumns(item: any) {
        return item.columnId;
    }

    public trackByIdentity = <T>(index: number, _: T): number => index;

    public labelDropdown(): void {
        this.selectedContactLabel = [];

        for (let row of this.viewData) {
            this.dropdownSelectionArray.push(new FormControl());
            if (row['companyContactLabel']) {
                this.selectedContactLabel.push(row['companyContactLabel']);
            } else if (row['companyAccountLabel']) {
                this.selectedContactLabel.push(row['companyAccountLabel']);
            }
        }
    }
    // Attachment Update
    checkAttachmentUpdate() {
        if (this.activeAttachment !== -1) {
            let entity = this.activeTableData?.gridNameTitle;

            if (
                entity === TableStringEnum.REPAIR &&
                this.selectedTab === TableStringEnum.REPAIR_SHOP
            )
                entity = TableStringEnum.REPAIR_SHOP_2;

            this.filesService
                .getFiles(entity, this.activeAttachment)
                .subscribe((res) => {
                    if (res?.length) {
                        const newViewData = [...this.viewData];

                        newViewData.map((data: any) => {
                            if (data.id === this.activeAttachment) {
                                data.tableAttachments = res;
                                data.fileCount = res.length;
                            }
                        });
                        this.viewData = [...newViewData];
                    }
                });
        }
    }

    // Horizontal Scroll
    onHorizontalScroll(scrollEvent: any) {
        if (scrollEvent.eventAction === 'scrolling') {
            let isMaxScroll = false;

            document
                .querySelectorAll('#table-not-pined-scroll-container')
                .forEach((el) => {
                    el.scrollLeft = scrollEvent.scrollPosition;

                    if (
                        Math.round(scrollEvent.scrollPosition) ===
                        Math.round(el.scrollWidth - el.clientWidth)
                    ) {
                        isMaxScroll = true;
                    }
                });

            this.horizontalScrollPosition = scrollEvent.scrollPosition;

            this.tableService.sendScroll(scrollEvent.scrollPosition);

            if (scrollEvent.scrollPosition > 0) {
                this.isLeftScrollLineShown = true;

                this.isRightScrollLineShown = !isMaxScroll;
            } else {
                this.isLeftScrollLineShown = false;
            }

            this.changeDetectorRef.detectChanges();
        } else if (
            scrollEvent.eventAction === 'isScrollShowing' &&
            this.showScrollSectionBorder !== scrollEvent.isScrollBarShowing
        ) {
            this.showScrollSectionBorder = scrollEvent.isScrollBarShowing;

            this.tableService.sendIsScrollShownig(this.showScrollSectionBorder);

            if (!scrollEvent.isScrollBarShowing) {
                this.isLeftScrollLineShown = false;
                this.isRightScrollLineShown = false;
            } else {
                this.isRightScrollLineShown = true;
            }

            this.changeDetectorRef.detectChanges();
        }
    }

    // Get Table Sections
    getTableSections() {
        this.pinedColumns = [];
        this.notPinedColumns = [];
        this.actionsColumns = [];

        this.tableWidth = 0;
        this.pinedWidth = 0;
        this.actionsWidth = 0;

        let notPinedWidth = 0;

        this.columns.map((c: any, i: number) => {
            // Pined
            if (c.isPined && !c.isAction && !c.hidden) {
                this.pinedColumns.push({
                    ...c,
                    columnId: c.name + i,
                });

                this.pinedWidth += c.minWidth > c.width ? c.minWidth : c.width;

                if (
                    c.ngTemplate !== '' &&
                    c.ngTemplate !== 'checkbox' &&
                    c.ngTemplate !== 'user-checkbox'
                ) {
                    this.pinedWidth += 6;
                }
            }

            // Not Pined
            if (!c.isPined && !c.isAction && !c.hidden) {
                this.notPinedColumns.push({
                    ...c,
                    columnId: c.name + i,
                });

                notPinedWidth +=
                    c.minWidth > c.width ? c.minWidth + 6 : c.width + 6;
            }

            // Actions
            if (c.isAction && !c.hidden) {
                this.actionsColumns.push({
                    ...c,
                    columnId: c.name + i,
                });

                this.actionsWidth +=
                    c.minWidth > c.width ? c.minWidth : c.width;
            }
        });

        this.tableWidth =
            this.actionsWidth + notPinedWidth + this.pinedWidth + 22;

        this.isDropdownPositionBottom = this.tableWidth > 1650;
    }

    // Get Tab Table Data For Selected Tab
    getSelectedTabTableData() {
        if (this.tableData?.length) {
            this.activeTableData = this.tableData.find(
                (t) => t.field === this.selectedTab
            );
        }
    }

    // Get Not Pined Section Of Table Max Width
    getNotPinedMaxWidth() {
        if (this.viewData.length) {
            clearTimeout(this.tableWidthTimeout);

            const tableContainer = document.querySelector('.table-container');

            this.notPinedMaxWidth =
                tableContainer?.clientWidth -
                (this.pinedWidth + this.actionsWidth) -
                14;

            this.changeDetectorRef.detectChanges();

            this.tableWidthTimeout = setTimeout(() => {
                const table = document.querySelector('.table-tr');

                this.tableWidth = table?.clientWidth ? table.clientWidth : 0;

                this.changeDetectorRef.detectChanges();
            }, 100);
        }
    }

    // Go To Details Page
    goToDetails(route: any, row: any) {
        if (!route.link?.doesNotHaveRout) {
            const link =
                route.link.routerLinkStart +
                row['id'] +
                route.link.routerLinkEnd;

            this.detailsDataService.setNewData(row);

            this.router.navigate([link]);
        }
    }

    // Select Row
    onSelectItem(rowData: any, index: number): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        if (rowData.isSelected) {
            this.mySelection.push({ id: rowData.id, tableData: rowData });
        } else {
            const index = this.mySelection.findIndex(
                (selection) => rowData.id === selection.id
            );

            if (index !== -1) {
                this.mySelection.splice(index, 1);
            }
        }

        this.tableService.sendRowsSelected(this.mySelection);
    }

    // Show Password
    onShowPassword(row: any, column: any) {
        row[column.field].apiCallStarted = true;

        setTimeout(() => {
            row[column.field].apiCallStarted = false;
            row[column.field].hiden = !row[column.field].hiden;

            this.changeDetectorRef.detectChanges();
        }, 1000);
    }

    // RATING
    public onLikeDislike(isLike: boolean, rowData: T): void {
        const type = isLike
            ? DropdownMenuStringEnum.RATING_LIKE_TYPE
            : DropdownMenuStringEnum.RATING_DISLIKE_TYPE;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                rowData
            );

        this.tableBodyActions.emit(emitEvent);
    }

    // HIRE
    onHire(row: any) {
        this.bodyActions.emit({
            data: row,
            type: 'hire',
        });
    }

    // FAVORITE
    public onFavorite(
        id: number,
        isFavorite: boolean,
        isDisabled: boolean
    ): void {
        if (isDisabled) return;

        const type = isFavorite
            ? DropdownMenuStringEnum.UNMARK_FAVORITE_TYPE
            : DropdownMenuStringEnum.MARK_AS_FAVORITE_TYPE;

        const data = {
            favourite: isFavorite,
        } as T & { favourite?: boolean };

        this.tableBodyActions.emit({
            id,
            type,
            data,
        });
    }

    // --------------------------------DROPDOWN---------------------------------

    // Show More Data
    public handleShowMoreClick(): void {
        this.tableBodyActions.emit({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    // Set Dropdown Content
    setDropContent() {
        this.dropContent = [];

        if (this.options?.actions?.length) {
            for (let i = 0; i < this.options.actions.length; i++) {
                this.dropContent.push(this.options.actions[i]);
            }
        }
    }

    // Toggle Dropdown
    public handleToggleDropdownMenuActions(
        event: DropdownMenuOptionEmit,
        rowData: T
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                rowData
            );

        this.tableBodyActions.emit(emitEvent);
    }

    toggleDropdown(tooltip: NgbTooltip, row: any) {
        this.tooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            if (row.tableDropdownContent?.hasContent) {
                let actions = [...row.tableDropdownContent.content];

                actions = actions.map((actions: any) => {
                    if (actions?.isDropdown) {
                        return {
                            ...actions,
                            isInnerDropActive: false,
                        };
                    }

                    return actions;
                });

                this.dropdownActions = [...actions];

                const dropdownData = {
                    companyUserId: row.companyUserId,
                    data: this.dropdownActions,
                };

                tooltip.open({ data: dropdownData });
            }
        }

        this.dropDownActive = tooltip.isOpen() ? row.id : -1;
        this.rowData = row;
        this.detailsDataService.setNewData(row);
    }

    // Dropdown Actions
    onDropAction(action: any) {
        // To Unselect All Selected Rows
        if (action.name === 'activate-item') {
            this.mySelection = [];

            this.tableService.sendRowsSelected(this.mySelection);

            const viewData = this.viewData;

            viewData.map((v) => {
                v.isSelected = false;
            });

            this.viewData = [...viewData];
        }

        // Only If Action Is Not Muted
        if (!action?.isDisabled) {
            // Send Drop Action
            this.bodyActions.emit({
                id: this.dropDownActive,
                data: this.rowData,
                type: action.name,
            });
        }

        this.tooltip.close();
    }

    // On Show Inner Dropdown
    onShowInnerDropdown(action) {
        this.onRemoveClickEventListener();

        let innerContent = '';

        let newDropdownActions = [...this.dropdownActions];

        newDropdownActions.map((actions) => {
            if (
                actions.isDropdown &&
                actions.isInnerDropActive &&
                actions.title !== action.title
            ) {
                actions.isInnerDropActive = false;
                actions.innerDropElement = null;
            }
        });

        this.dropdownActions = [...newDropdownActions];

        if (action?.isDropdown && !action.isInnerDropActive) {
            action.insideDropdownContent.map((content: any) => {
                innerContent += `<div id="${content.title}" class="inner-dropdown-action-title">${content.title}</div>`;
            });

            action.innerDropElement =
                this.sanitizer.bypassSecurityTrustHtml(innerContent);
        }

        action.isInnerDropActive = !action.isInnerDropActive;

        if (action.isInnerDropActive) {
            this.setInnerDropdownClickEvent();
        }
    }

    // Set Click Event On Inner Dropdown
    setInnerDropdownClickEvent() {
        setTimeout(() => {
            const innerDropdownContent = document.querySelectorAll(
                '.inner-dropdown-action-title'
            );

            innerDropdownContent.forEach((content) => {
                content.addEventListener('click', () => {
                    this.dropdownActions.map((action: any) => {
                        if (action.isInnerDropActive) {
                            action.insideDropdownContent.map(
                                (innerAction: any) => {
                                    if (content.id === innerAction.title) {
                                        this.onRemoveClickEventListener();

                                        setTimeout(() => {
                                            this.onDropAction(innerAction);
                                        }, 100);
                                    }
                                }
                            );
                        }
                    });
                });
            });
        }, 100);
    }

    // Remove Click Event On Inner Dropdown
    onRemoveClickEventListener() {
        const innerDropdownContent = document.querySelectorAll(
            '.inner-dropdown-action-title'
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners('click');
        });

        this.dropDownActive = -1;
    }

    // Toggle Status Dropdown
    public toggleStatusDropdown(tooltip: NgbTooltip, row: any): void {
        this.loadId = row.id;
        this.loadService
            .getLoadStatusDropdownOptions(row.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.statusTooltip = tooltip;
                if (tooltip.isOpen()) {
                    tooltip.close();
                } else {
                    tooltip.open();
                }
                this.statusDetails = res;
            });
        this.statusDropdownActive = tooltip.isOpen() ? row.id : -1;
        this.statusDropdownData = row;
    }

    public toggleStopsDropdown(
        tooltip: NgbTooltip,
        width: number,
        row: any
    ): void {
        this.isLoading = true;
        this.statusTooltip = tooltip;
        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }
        this.widthPopover = width;

        if (row.stops?.length) {
            const totalLegMiles = row.stops.reduce(
                (total, leg) => total + leg.legMiles,
                0
            );
            this.stops = { loadStops: row.stops, totalMiles: totalLegMiles };
            this.isLoading = false;
        } else {
            this.loadService
                .getLoadListLoadstop(row.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((stops) => {
                    this.stops = stops;
                    this.isLoading = false;
                });
        }
    }

    // Show Description Dropdown
    public onShowDescriptionDropdown(
        popover: NgbPopover,
        tableType: string,
        columnWidth: number,
        row: any,
        field?: string
    ): void {
        let data = null;

        switch (tableType) {
            case TableStringEnum.REPAIR:
                const {
                    isRepairOrder,
                    tableDescription,
                    tableDescriptionDropTotal,
                } = row;

                const repairItemsData = {
                    isRepairOrder,
                    descriptionItems: tableDescription,
                    totalCost: tableDescriptionDropTotal,
                };

                this.widthPopover = isRepairOrder
                    ? columnWidth
                    : columnWidth + 105;

                data = repairItemsData;

                break;
            case TableStringEnum.FUEL:
                const fuelItemsData = {
                    isFuelDescription: true,
                    descriptionItems: row.tableDescription,
                    totalCost: row.tableDescriptionDropTotal,
                };

                this.widthPopover = columnWidth + 255;

                data = fuelItemsData;

                break;
            case TableStringEnum.DRIVER_1:
                if (field === TableStringEnum.TABLE_OFF_DUTY_LOCATIONS) {
                    const offDutyLocationItemsData = {
                        isDriverDescription: true,
                        isOffDutyLocations: true,
                        descriptionItems: row.tableOffDutyLocation,
                    };

                    data = offDutyLocationItemsData;
                } else {
                    const restrictionEndorsementItemsData = {
                        isDriverDescription: true,
                        isOffDutyLocations: false,
                        isRestrictions:
                            field ===
                            TableStringEnum.TABLE_CDL_DETAIL_RESTRICTION,
                        descriptionItems:
                            field ===
                            TableStringEnum.TABLE_CDL_DETAIL_RESTRICTION
                                ? row.tableCdlDetailRestriction
                                : row.tableCdlDetailEndorsment,
                    };

                    data = restrictionEndorsementItemsData;
                }

                this.widthPopover = columnWidth;

                break;
            default:
                break;
        }

        popover.isOpen() ? popover.close() : popover.open({ data });
    }

    // Show Invoice Aging Dropdown
    public onShowInvoiceAgingDropdown<T extends { id: number; field: string }>(
        popover: NgbPopover,
        row: T,
        column: T
    ): void {
        popover.toggle();

        this.invoiceDropdownActive = popover.isOpen() ? row.id : -1;
        this.invoiceDropdownType = popover.isOpen() ? column.field : null;

        const columnData = row[column.field];

        const {
            invoiceAgeingGroupOne,
            invoiceAgeingGroupTwo,
            invoiceAgeingGroupThree,
            invoiceAgeingGroupFour,
        } = columnData;

        this.invoiceDropdownData = {
            isUnPaidAging:
                column?.field === TableStringEnum.TABLE_UNPAID_INV_AGING,
            invAgingGroups: [
                invoiceAgeingGroupOne,
                invoiceAgeingGroupTwo,
                invoiceAgeingGroupThree,
                invoiceAgeingGroupFour,
            ],
        };
    }

    // Only For User Table To Activate User
    onActivateUser(row: any) {
        this.bodyActions.emit({
            id: row.id,
            data: row,
            type: 'activate',
        });
    }

    // Show Attachments
    onShowAttachments(row: any) {
        if (this.activeAttachment !== row.id) {
            let entity = this.activeTableData?.gridNameTitle?.toLowerCase();

            if (
                entity === TableStringEnum.REPAIR &&
                this.selectedTab === TableStringEnum.REPAIR_SHOP
            )
                entity = TableStringEnum.REPAIR_SHOP_2;

            this.filesService.getFiles(entity, row.id).subscribe((res) => {
                if (res?.length) {
                    this.activeAttachment = row.id;
                    row.tableAttachments = res;

                    this.changeDetectorRef.detectChanges();
                }
            });
        } else {
            this.activeAttachment = -1;
        }
    }

    // Show Media
    onShowMedia(row: any) {
        if (this.activeMedia !== row.id) {
            this.activeMedia = row.id;
        } else {
            this.activeMedia = -1;
        }
    }

    // Show Insurance
    onShowInsurance(row: any) {
        if (this.activeInsurance !== row.id) {
            this.activeInsurance = row.id;
        } else {
            this.activeInsurance = -1;
        }
    }

    // Finish Order
    public onFinishOrder(rowData: T): void {
        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                DropdownMenuStringEnum.FINISH_ORDER_TYPE,
                rowData
            );

        this.tableBodyActions.emit(emitEvent);
    }

    // Contacts dropdown actions
    public onAddContact(row: any): void {
        this.bodyActions.emit({
            id: row.id,
            data: row,
            type: TableStringEnum.ADD_CONTACT,
        });
    }

    public onEditContact(row: any): void {
        this.bodyActions.emit({
            id: row.id,
            data: row,
            type: TableStringEnum.EDIT_CONTACT,
        });
    }

    public onDeleteContact(row: any): void {
        this.bodyActions.emit({
            id: row.id,
            data: row,
            type: TableStringEnum.DELTETE_CONTACT,
        });
    }

    // Label actions
    public onSaveLabel(
        data: { data: { name: string; action: string } },
        index: number
    ): void {
        this.selectedContactLabel[index] = {
            ...this.selectedContactLabel[index],
            name: data.data.name,
        };

        this.tableBodyActions.emit({
            type: data.data?.action || DropdownMenuStringEnum.CREATE_LABEL,
            data: this.selectedContactLabel[index] as T,
            id: this.viewData[index].id,
        });
    }

    public onPickExistLabel(
        event: CompanyAccountLabelResponse,
        index: number
    ): void {
        this.selectedContactLabel[index] = event;

        this.onSaveLabel(
            {
                data: {
                    name: this.selectedContactLabel[index].name,
                    action: DropdownMenuStringEnum.UPDATE_LABEL,
                },
            },
            index
        );
    }

    public onSelectColorLabel(
        event: CompanyAccountLabelResponse,
        index: number
    ): void {
        this.selectedContactColor = event;

        this.selectedContactLabel[index] = {
            ...this.selectedContactLabel[index],
            colorId: this.selectedContactColor.id,
            color: this.selectedContactColor.name,
            code: this.selectedContactColor.code,
            hoverCode: this.selectedContactColor.hoverCode,
        };
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    public addPmItem(row: any): void {
        this.bodyActions.emit({
            data: row,
            type: TableStringEnum.ADD_PM_ITEM,
        });
    }

    // --------------------------------ON DESTROY---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendRowsSelected([]);
        this.tableService.sendCurrentSetTableWidth(null);
        this.tableService.sendIsScrollShownig(false);
        this.tableService.sendIsScrollReseting(true);
        this.caSearchMultipleStatesService.sendChipsForHighlightSearchToTable(
            []
        );
    }
}
