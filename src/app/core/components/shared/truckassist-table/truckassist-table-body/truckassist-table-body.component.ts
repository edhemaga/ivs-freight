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

//scrolling
import {
    CdkVirtualScrollViewport,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

//strategy
import { TableStrategy } from './table_strategy';
import { Subject, takeUntil } from 'rxjs';

//services
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { DetailsDataService } from '../../../../services/details-data/details-data.service';
import { FilesService } from 'src/app/core/services/shared/files.service';

//decorators
import { Titles } from 'src/app/core/utils/application.decorators';

//components
import { CustomScrollbarComponent } from '../../custom-scrollbar/custom-scrollbar.component';
import { TaNoteComponent } from '../../ta-note/ta-note.component';
import { TaUploadFilesComponent } from '../../ta-upload-files/ta-upload-files.component';
import { TaInputDropdownLabelComponent } from '../../ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaInputDropdownComponent } from '../../ta-input-dropdown/ta-input-dropdown.component';
import { AppTooltipComponent } from '../../app-tooltip/app-tooltip.component';

//modul
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

//sanitizer
import { DomSanitizer } from '@angular/platform-browser';

//pipes
import { TableHighlightSearchTextPipe } from 'src/app/core/pipes/table-highlight-search-text.pipe';

//models
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import {
    tableBodyColorLabel,
    tableBodyColumns,
    tableBodyOptions,
} from '../../model/tableBody';
import { TaInputDropdownTableComponent } from '../../../standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';

@Titles()
@Component({
    selector: 'app-truckassist-table-body',
    templateUrl: './truckassist-table-body.component.html',
    styleUrls: ['./truckassist-table-body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CustomScrollbarComponent,
        AngularSvgIconModule,
        TaNoteComponent,
        TaUploadFilesComponent,
        NgbPopoverModule,
        TableHighlightSearchTextPipe,
        TaInputDropdownLabelComponent,
        TaInputDropdownComponent,
        NgbPopoverModule,
        TaInputDropdownTableComponent,
        NgbModule,
        AppTooltipComponent,
    ],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useClass: TableStrategy,
        },
    ],
})
export class TruckassistTableBodyComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();
    @ViewChild('tableScrollRef', { static: false })
    public virtualScrollViewport: CdkVirtualScrollViewport;
    public selectedContactColor: CompanyAccountLabelResponse;

    @ViewChild('tableFiles', { static: false }) public tableFiles: any;

    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    public dropdownSelectionArray = new FormArray([]);

    @Input() viewData: any[];
    @Input() columns: tableBodyColumns[];
    @Input() options: tableBodyOptions;
    @Input() tableData: any[];
    @Input() selectedTab: string;
    public selectedContactLabel: tableBodyColorLabel[] = [];
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
    activeDescriptionDropdown: number = -1;
    descriptionTooltip: any;
    descriptionPopoverOpen: number = -1;
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

    constructor(
        private router: Router,
        private tableService: TruckassistTableService,
        private changeDetectorRef: ChangeDetectorRef,
        private sharedService: SharedService,
        private detailsDataService: DetailsDataService,
        private filesService: FilesService,
        private sanitizer: DomSanitizer
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
                                this.mySelection.push({ id: data.id });
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
        this.tableService.currentChipsForHighlightSearchToTable
            .pipe(takeUntil(this.destroy$))
            .subscribe((chips: string[]) => {
                this.chipsForHighlight = chips.length ? chips : [];
            });

        // Scrolling Virtual Container
        // this.sharedService.emitTableScrolling
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((offSet: any) => {
        //         if (offSet < 84) {
        //             this.virtualScrollViewport.scrollToOffset(0);
        //         } else if (offSet > 84) {
        //             this.virtualScrollViewport.scrollToOffset(offSet);
        //         }
        //     });
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
        // For Virtual Scroll
        // setTimeout(() => {
        //     if (this.viewData.length) {
        //         const tableContainer =
        //             document.querySelector('.table-container');

        //         const cdkVirtualScrollSpacer = document.querySelector(
        //             '.cdk-virtual-scroll-spacer'
        //         );

        //         const pageHeight =
        //             tableContainer.clientHeight -
        //             1018 +
        //             cdkVirtualScrollSpacer.clientHeight;

        //         this.sharedService.emitUpdateScrollHeight.emit({
        //             tablePageHeight: pageHeight,
        //         });
        //     }
        // }, 10);

        this.getNotPinedMaxWidth();
    }

    // Render Row One By One
    renderOneByOne() {
        // clearInterval(this.renderInterval);
        // if(this.viewData.length - 1 <= this.tableRowCounter){
        //     this.tableRowCounter = 0;
        // }
        // this.renderInterval = setInterval(() => {
        //     this.tableRowCounter++;
        //     this.changeDetectorRef.detectChanges();
        //     if (this.tableRowCounter >= this.viewData.length - 1) {
        //         clearInterval(this.renderInterval);
        //     }
        // }, 1);
    }

    // Track By For Table Row
    trackTableRow(item: any) {
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

    // Track By For Actions Columns
    trackTableActionsColumns(item: any) {
        return item.columnId;
    }
    public labelDropdown(): void {
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

            if (entity === 'Repair' && this.selectedTab === 'repair-shop')
                entity = 'Repair-Shop';

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
            document
                .querySelectorAll('#table-not-pined-scroll-container')
                .forEach((el) => {
                    el.scrollLeft = scrollEvent.scrollPosition;
                });

            this.horizontalScrollPosition = scrollEvent.scrollPosition;

            this.tableService.sendScroll(scrollEvent.scrollPosition);
        } else if (
            scrollEvent.eventAction === 'isScrollShowing' &&
            this.showScrollSectionBorder !== scrollEvent.isScrollBarShowing
        ) {
            this.showScrollSectionBorder = scrollEvent.isScrollBarShowing;

            this.tableService.sendIsScrollShownig(this.showScrollSectionBorder);

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
                tableContainer.clientWidth -
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

    // RAITING
    onLike(row: any) {
        this.detailsDataService.setNewData(row);
        this.bodyActions.emit({
            data: row,
            type: 'raiting',
            subType: 'like',
        });
    }

    onDislike(row: any) {
        this.detailsDataService.setNewData(row);

        this.bodyActions.emit({
            data: row,
            type: 'raiting',
            subType: 'dislike',
        });
    }

    onOpenReviews(row: any) {
        this.bodyActions.emit({
            data: row,
            type: 'open-reviews',
        });
    }

    // HIRE
    onHire(row: any) {
        this.bodyActions.emit({
            data: row,
            type: 'hire',
        });
    }

    // FAVORITE
    onFavorite(row: any) {
        this.bodyActions.emit({
            data: row,
            type: 'favorite',
        });
    }

    // --------------------------------DROPDOWN---------------------------------

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
    toggleDropdown(tooltip: any, row: any) {
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

                tooltip.open({ data: this.dropdownActions });
            }
        }

        this.dropDownActive = tooltip.isOpen() ? row.id : -1;
        this.rowData = row;
        this.detailsDataService.setNewData(row);
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
    }

    // Toggle Status Dropdown
    toggleStatusDropdown(tooltip: any, row: any) {
        this.statusTooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }

        this.statusDropdownActive = tooltip.isOpen() ? row.id : -1;
        this.statusDropdownData = row;
    }

    // Show Description Dropdown
    onShowDescriptionDropdown(popup: any, row: any) {
        if (row.descriptionItems.length > 1) {
            this.descriptionTooltip = popup;

            if (popup.isOpen()) {
                popup.close();
            } else {
                popup.open({ data: row });
            }

            this.activeDescriptionDropdown = popup.isOpen() ? row.id : -1;
        }
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
        if (!action?.mutedStyle) {
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

            if (entity === 'repair' && this.selectedTab === 'repair-shop')
                entity = 'repair-shop';

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

    // Save Inspectin Description
    onSaveInspectinDescription() {}

    // Finish Order
    onFinishOrder(row: any) {
        this.bodyActions.emit({
            data: row,
            type: 'finish-order',
        });
    }

    // Show More Data
    onShowMore() {
        this.bodyActions.emit({
            type: 'show-more',
        });
    }

    public onSaveLabel(
        data: { data: { name: string; action: string } },
        index: number
    ): void {
        this.selectedContactLabel[index] = {
            ...this.selectedContactLabel[index],
            name: data.data.name,
        };

        this.bodyActions.emit({
            data: this.selectedContactLabel[index],
            id: this.viewData[index].id,
            type:
                data.data?.action == 'update-label'
                    ? 'update-label'
                    : 'label-change',
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
                    action: 'update-label',
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
    // --------------------------------ON DESTROY---------------------------------
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendRowsSelected([]);
        this.tableService.sendCurrentSetTableWidth(null);
        this.tableService.sendIsScrollShownig(false);
        this.tableService.sendIsScrollReseting(true);
        this.tableService.sendChipsForHighlightSearchToTable([]);
    }
}
