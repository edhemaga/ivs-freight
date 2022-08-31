import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

import { SharedService } from 'src/app/core/services/shared/shared.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { DashboardStrategy } from './dashboard_strategy';

@UntilDestroy()
@Component({
  selector: 'app-truckassist-table-body',
  templateUrl: './truckassist-table-body.component.html',
  styleUrls: ['./truckassist-table-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: DashboardStrategy,
    },
  ],
})
export class TruckassistTableBodyComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
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
  notPinedMaxWidth: number = 0;
  showMoreContainerWidth: number = 220;
  dropContent: any[] = [];
  tooltip: any;
  dropDownActive: number = -1;
  progressData: any[] = [];
  checkForScrollTimeout: any;
  viewDataEmpty: number;
  viewDataTimeOut: any;
  rowData: any;
  activeDescriptionDropdown: number = -1;
  descriptionTooltip: any;
  pageHeight: number = window.innerHeight;
  activeAttachments: number = -1;
  attachmentsTooltip: any;
  isAttachmentClosing: boolean;

  constructor(
    private router: Router,
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}

  // --------------------------------NgOnInit---------------------------------
  ngOnInit(): void {
    this.viewDataEmpty = this.viewData.length;

    if (this.viewDataEmpty) {
      this.getTableSections();
    }

    // Get Selected Tab Data
    this.getSelectedTabTableData();

    // Set Dropdown Content
    this.setDropContent();

    // Select Or Deselect All
    this.tableService.currentSelectOrDeselect
      .pipe(untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.columnsOrder) {
          this.columns = response.columnsOrder;

          this.getTableSections();

          this.changeDetectorRef.detectChanges();

          console.log('Poziva se iz currentColumnsOrder');
          this.getNotPinedMaxWidth();
        }
      });

    // Reset Selected Columns
    this.tableService.currentResetSelectedColumns
      .pipe(untilDestroyed(this))
      .subscribe((reset: boolean) => {
        if (reset) {
          this.mySelection = [];
        }
      });
  }

  // --------------------------------NgOnChanges---------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.viewData?.firstChange && changes?.viewData) {
      clearTimeout(this.viewDataTimeOut);

      this.viewData = changes.viewData.currentValue;

      if (!this.viewDataEmpty && changes.viewData.currentValue) {
        this.viewDataTimeOut = setTimeout(() => {
          console.log('Poziva se iz ngOnChanges viewData');
          this.getNotPinedMaxWidth();
          this.getSelectedTabTableData();
        }, 10);
      }

      this.viewDataEmpty = this.viewData.length;
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.getSelectedTabTableData();
    }

    if (
      !changes?.tableContainerWidth?.firstChange &&
      changes?.tableContainerWidth &&
      changes?.tableContainerWidth?.previousValue > 0
    ) {
      console.log('Poziva se iz ngOnChanges tableContainerWidth');
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
        console.log('Poziva se iz ngOnChanges columns');
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
  }

  // --------------------------------NgAfterViewInit---------------------------------
  ngAfterViewInit(): void {
    this.sharedService.emitUpdateScrollHeight.emit(true);

    console.log('Poziva se iz ngAfterViewInit');
    this.getNotPinedMaxWidth();
  }

  // Lisiner For Scrolling Of Not Pined Section Of Table
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.className === 'not-pined-tr') {
      this.tableService.sendScroll(event.path[0].scrollLeft);
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
    }
  }

  // Get Not Pined Section Of Table Max Width
  getNotPinedMaxWidth() {
    if (this.viewData.length) {
      const tableContainer = document.querySelector('.table-container');

      this.notPinedMaxWidth =
        tableContainer.clientWidth - (this.pinedWidth + this.actionsWidth) - 8;

      /* this.checkForScroll(); */
    }
  }

  // Check If Scroll Exists On Not Pined Section Of Table
  checkForScroll() {
    const div = document.getElementById('scroll-container');
    const pinedColumns = document.querySelector('.pined-tr');
    const actionColumns = document.querySelector('.actions');

    if (div) {
      this.checkForScrollTimeout = setTimeout(() => {
        this.showScrollSectionBorder = div.scrollWidth > div.clientWidth;

        let notPinedWidth =
          div.clientWidth <= this.notPinedMaxWidth
            ? div.clientWidth
            : this.notPinedMaxWidth;

        this.showMoreContainerWidth +=
          pinedColumns.clientWidth + actionColumns.clientWidth + notPinedWidth;

        this.changeDetectorRef.detectChanges();
      }, 100);
    }
  }

  // Go To Details Page
  goToDetails(route: any, row: any) {
    const link =
      route.link.routerLinkStart + row['id'] + route.link.routerLinkEnd;
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
    this.bodyActions.emit({
      data: row,
      type: 'raiting',
      subType: 'like',
    });
  }

  onDislike(row: any) {
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
  onShowAttachments(popup: any, row: any) {
    if (!popup.isOpen()) {
      let timeInterval = 0;

      if (this.activeAttachments !== -1 && this.activeAttachments !== row.id) {
        timeInterval = 250;
      }

      setTimeout(() => {
        this.isAttachmentClosing = false;
        this.attachmentsTooltip = popup;

        if (popup.isOpen()) {
          popup.close();
        } else {
          popup.open({ data: row });
        }

        this.activeAttachments = popup.isOpen() ? row.id : -1;
      }, timeInterval);
    }
  }

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
