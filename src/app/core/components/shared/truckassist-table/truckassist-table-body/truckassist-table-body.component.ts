import {
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
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
  selector: 'app-truckassist-table-body',
  templateUrl: './truckassist-table-body.component.html',
  styleUrls: ['./truckassist-table-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckassistTableBodyComponent
  implements OnInit, OnChanges, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();
  @Input() viewData: any[];
  @Input() columns: any[];
  @Input() options: any[];
  @Input() selectedTab: string;
  @Output() bodyActions: EventEmitter<any> = new EventEmitter();
  mySelection: any[] = [];
  showItemDrop: number = -1;
  loadingPassword: number = -1;
  showPassword: any[] = [];
  decryptedPassword: any[] = [];
  actionsMinWidth: number = 0;

  constructor(
    private router: Router,
    private tableService: TruckassistTableService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

    // Rezaize
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

          this.changeDetectorRef.detectChanges();
        }
      });

    // Columns Reorder
    this.tableService.currentColumnsOrder
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.columnsOrder) {
          this.columns = response.columnsOrder;

          this.changeDetectorRef.detectChanges();
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

          this.changeDetectorRef.detectChanges();
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
      this.viewData = changes.viewData.currentValue;
    }

    if (
      changes?.columns &&
      !changes?.columns?.firstChange &&
      changes.columns.currentValue !== changes.columns.previousValue
    ) {
      this.columns = changes.columns.currentValue;
    }

    if (
      !changes?.selectedTab?.firstChange &&
      changes?.selectedTab?.currentValue !==
        changes?.selectedTab?.previousValue &&
      changes?.selectedTab
    ) {
      this.selectedTab = changes.selectedTab.currentValue;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if(event.target.className === 'not-pined-tr'){
      this.tableService.sendScroll(event.path[0].scrollLeft);
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

  onDropAction(event: any) {
    this.bodyActions.emit(event);
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

  onShowItemDrop(index: number) {}

  onShowPassword(index: number) {
    this.loadingPassword = index;
  }

  ngOnDestroy(): void {
    this.tableService.sendRowsSelected([]);

    this.destroy$.next();
    this.destroy$.complete();
  }
}
