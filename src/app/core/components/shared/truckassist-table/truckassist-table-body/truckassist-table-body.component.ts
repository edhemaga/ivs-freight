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

@UntilDestroy()
@Component({
  selector: 'app-truckassist-table-body',
  templateUrl: './truckassist-table-body.component.html',
  styleUrls: ['./truckassist-table-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckassistTableBodyComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() viewData: any[];
  @Input() columns: any[];
  @Input() options: any;
  @Input() tableData: any[];
  @Input() selectedTab: string;
  @Input() tableContainerWidth: number;
  @Output() bodyActions: EventEmitter<any> = new EventEmitter();
  mySelection: any[] = [];
  showItemDrop: number = -1;
  loadingPassword: number = -1;
  showPassword: any[] = [];
  decryptedPassword: any[] = [];
  actionsMinWidth: number = 0;
  showScrollSectionBorder: boolean = false;
  hoverActive: number = -1;
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

  constructor(
    private router: Router,
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService
  ) { }
  ngOnInit(): void {
    this.viewDataEmpty = this.viewData.length;

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

          this.changeDetectorRef.detectChanges();

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

    this.columns.map((c) => {
      if (c.isAction) {
        this.actionsMinWidth += c.width;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.viewData?.firstChange && changes?.viewData) {
      clearTimeout(this.viewDataTimeOut);

      this.viewData = changes.viewData.currentValue;

      if (!this.viewDataEmpty && changes.viewData.currentValue) {
        this.viewDataTimeOut = setTimeout(() => {
          this.getNotPinedMaxWidth();
        }, 10);
      }

      this.viewDataEmpty = this.viewData.length;
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
  }

  ngAfterViewInit(): void {
    this.sharedService.emitUpdateScrollHeight.emit(true);
    this.getNotPinedMaxWidth();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.className === 'not-pined-tr') {
      this.tableService.sendScroll(event.path[0].scrollLeft);
    }
  }

  getNotPinedMaxWidth() {
    if (this.viewData.length) {
      const tableContainer = document.querySelector('.table-container');
      const pinedColumns = document.querySelector('.pined-tr');
      const actionColumns = document.querySelector('.actions');

      this.notPinedMaxWidth =
        tableContainer.clientWidth -
        (pinedColumns.clientWidth + actionColumns.clientWidth) -
        8;

      this.checkForScroll();
    }
  }

  getSelectedTabTableData() {
    if (this.tableData?.length) {
      this.activeTableData = this.tableData.find(
        (t) => t.field === this.selectedTab
      );
    }
  }

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

  trackByFn(index) {
    return index;
  }

  goToDetails(route: any, row: any) {
    const link =
      route.link.routerLinkStart + row['id'] + route.link.routerLinkEnd;
    this.router.navigate([link]);
  }

  saveNote(note: string, row: any) {
    alert('Treba da se odradi servis za slanje note-a');
  }

  public onSelectItem(event: any, index: number): void {
    this.viewData[index].isSelected = !this.viewData[index].isSelected;

    if (event.isSelected) {
      this.mySelection.push({ id: event.id });
    } else {
      const index = this.mySelection.findIndex(
        (selection) => event.id === selection.id
      );

      if (index !== -1) {
        this.mySelection.splice(index, 1);
      }
    }

    this.tableService.sendRowsSelected(this.mySelection);
  }

  onShowAttachments(data: any) {
    alert('Treba da se odradi servis i componenta za Attachments');
  }

  onShowItemDrop(index: number) { }

  onShowPassword(index: number) {
    this.loadingPassword = index;
  }

  // --------------------------------DROPDOWN---------------------------------
  /* Set Dropdown Content */
  setDropContent() {
    if (this.options.actions.length) {
      for (let i = 0; i < this.options.actions.length; i++) {
        this.dropContent.push(this.options.actions[i]);
      }
    }
  }

  /* Toggle Dropdown */
  toggleDropdown(tooltip: any, id: number) {
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data: this.dropContent });
    }

    this.dropDownActive = tooltip.isOpen() ? id : -1;
  }

  /* Dropdown Actions */
  onDropAction(action: any) {
    this.bodyActions.emit({
      id: this.dropDownActive,
      type: action.name,
    });

    this.tooltip.close();
  }

  // Finish Order
  onFinishOrder(row: any){
    this.bodyActions.emit({
      data: row,
      type: 'finish-order',
    });
  }

  // --------------------------------ON DESTROY---------------------------------
  ngOnDestroy(): void {
    this.tableService.sendRowsSelected([]);
  }
}
