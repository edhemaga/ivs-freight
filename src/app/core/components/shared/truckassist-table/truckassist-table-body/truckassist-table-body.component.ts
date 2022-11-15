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
} from '@angular/core';
import { Router } from '@angular/router';

import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { TableStrategy } from './table_strategy';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { DetailsDataService } from '../../../../services/details-data/details-data.service';
import { TableType } from 'appcoretruckassist';

@Component({
  selector: 'app-truckassist-table-body',
  templateUrl: './truckassist-table-body.component.html',
  styleUrls: ['./truckassist-table-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Output() bodyActions: EventEmitter<any> = new EventEmitter();

  @Input() viewData: any[];
  @Input() columns: any[];
  @Input() options: any;
  @Input() tableData: any[];
  @Input() selectedTab: string;
  @Input() tableContainerWidth: number;

  pinedColumns: any = [];
  pinedWidth: number = 0;
  notPinedColumns: any = [];
  actionsColumns: any = [];
  actionsWidth: number = 0;
  mySelection: any[] = [];
  showItemDrop: number = -1;
  showScrollSectionBorder: boolean = false;
  activeTableData: any = {};
  tableConfigurationType: TableType;
  notPinedMaxWidth: number = 0;
  dropContent: any[] = [];
  tooltip: any;
  dropDownActive: number = -1;
  progressData: any[] = [];
  viewDataEmpty: boolean;
  viewDataTimeOut: any;
  rowData: any;
  activeDescriptionDropdown: number = -1;
  descriptionTooltip: any;
  pageHeight: number = window.innerHeight;
  activeAttachment: number = -1;
  activeMedia: number = -1;
  activeInsurance: number = -1;
  statusTooltip: any;
  statusDropdownActive: number = -1;
  statusDropdownData: any;
  showInspectinDescriptionEdit: boolean;
  editInspectinDescriptionText: string = '';

  constructor(
    private router: Router,
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private detailsDataService: DetailsDataService
  ) {}

  // --------------------------------NgOnInit---------------------------------
  ngOnInit(): void {
    // Get Selected Tab Data
    this.getSelectedTabTableData();

    // Get Table Configuration
    // this.tableService
    //   .getTableConfig(this.tableConfigurationType)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     console.log('Get Table Config');
    //     console.log(res);

    //     const driverConfig = JSON.parse(res.config);

    //     localStorage.setItem(
    //       `table-${res.tableType}-Configuration`,
    //       JSON.stringify(driverConfig)
    //     );
    //   });

    this.viewDataEmpty = this.viewData.length ? false : true;

    // Get Table Sections(Pined, Not Pined, Actions)
    this.getTableSections();

    // Set Dropdown Content
    this.setDropContent();

    // Select Or Deselect All
    this.tableService.currentSelectOrDeselect
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: string) => {
        if (response !== '') {
          const isSelect = response === 'select';
          this.mySelection = [];

          this.viewData = this.viewData.map((data) => {
            data.isSelected = isSelect;

            if (data.isSelected) {
              this.mySelection.push({ id: data.id });
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

    // Scrolling Virtual Container
    this.sharedService.emitTableScrolling
      .pipe(takeUntil(this.destroy$))
      .subscribe((offSet: any) => {
        if (offSet < 84) {
          this.virtualScrollViewport.scrollToOffset(0);
        } else if (offSet > 84) {
          this.virtualScrollViewport.scrollToOffset(offSet);
        }
      });
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
      }

      if (changes.viewData.currentValue[0]) {
        //this.detailsDataService.setNewData(changes.viewData.currentValue[0]);
      }
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.getSelectedTabTableData();
    }

    if (
      !changes?.tableContainerWidth?.firstChange &&
      changes?.tableContainerWidth &&
      changes?.tableContainerWidth?.previousValue > 0
    ) {
      this.getNotPinedMaxWidth();
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
    setTimeout(() => {
      if (this.viewData.length) {
        const tableContainer = document.querySelector('.table-container');

        const cdkVirtualScrollSpacer = document.querySelector(
          '.cdk-virtual-scroll-spacer'
        );

        const pageHeight =
          tableContainer.clientHeight -
          1018 +
          cdkVirtualScrollSpacer.clientHeight;

        this.sharedService.emitUpdateScrollHeight.emit({
          tablePageHeight: pageHeight,
        });
      }
    }, 10);

    this.getNotPinedMaxWidth();
  }

  onHorizontalScroll(scrollEvent: any) {
    if (scrollEvent.eventAction === 'scrolling') {
      document
        .querySelectorAll('#table-not-pined-scroll-container')
        .forEach((el) => {
          el.scrollLeft = scrollEvent.scrollPosition;
        });

      this.tableService.sendScroll(scrollEvent.scrollPosition);
    } else if (
      scrollEvent.eventAction === 'isScrollShowing' &&
      this.showScrollSectionBorder !== scrollEvent.isScrollBarShowing
    ) {
      this.showScrollSectionBorder = scrollEvent.isScrollBarShowing;

      this.changeDetectorRef.detectChanges();
    }
  }

  // Get Table Sections
  getTableSections() {
    this.pinedColumns = [];
    this.notPinedColumns = [];
    this.actionsColumns = [];

    this.pinedWidth = 0;
    this.actionsWidth = 0;

    this.columns.map((c: any) => {
      // Pined
      if (c.isPined && !c.isAction && !c.hidden) {
        this.pinedColumns.push(c);

        this.pinedWidth += c.minWidth > c.width ? c.minWidth : c.width;
      }

      // Not Pined
      if (!c.isPined && !c.isAction && !c.hidden) {
        this.notPinedColumns.push(c);
      }

      // Actions
      if (c.isAction && !c.hidden) {
        this.actionsColumns.push(c);

        this.actionsWidth += c.minWidth > c.width ? c.minWidth : c.width;
      }
    });
  }

  // Get Tab Table Data For Selected Tab
  getSelectedTabTableData() {
    if (this.tableData?.length) {
      this.activeTableData = this.tableData.find(
        (t) => t.field === this.selectedTab
      );

      this.tableConfigurationType = this.activeTableData.tableConfiguration;
    }
  }

  // Get Not Pined Section Of Table Max Width
  getNotPinedMaxWidth() {
    if (this.viewData.length) {
      const tableContainer = document.querySelector('.table-container');

      this.notPinedMaxWidth =
        tableContainer.clientWidth - (this.pinedWidth + this.actionsWidth) - 8;

      this.changeDetectorRef.detectChanges();
    }
  }

  // Go To Details Page
  goToDetails(route: any, row: any) {
    const link =
      route.link.routerLinkStart + row['id'] + route.link.routerLinkEnd;
    this.detailsDataService.setNewData(row);
    this.router.navigate([link]);
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

    if (this.options.actions.length) {
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
      tooltip.open({ data: this.dropContent });
    }

    this.dropDownActive = tooltip.isOpen() ? row.id : -1;
    this.rowData = row;
    this.detailsDataService.setNewData(row);
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
    this.descriptionTooltip = popup;

    if (popup.isOpen()) {
      popup.close();
    } else {
      popup.open({ data: row });
    }

    this.activeDescriptionDropdown = popup.isOpen() ? row.id : -1;
  }

  /* Dropdown Actions */
  onDropAction(action: any) {
    this.bodyActions.emit({
      id: this.dropDownActive,
      data: this.rowData,
      type: action.name,
    });

    this.tooltip.close();
  }

  // Show Attachments
  onShowAttachments(row: any) {
    if (this.activeAttachment !== row.id) {
      this.activeAttachment = row.id;
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

  // --------------------------------ON DESTROY---------------------------------
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendRowsSelected([]);
  }

  // --------------------------------TODO---------------------------------
  onShowItemDrop(index: number) {
    alert('Treba da se odradi');
  }

  saveNote(note: string, row: any) {
    alert('Treba da se odradi');
  }
}
