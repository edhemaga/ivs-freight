import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

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

  trackByFn(index) {
    return index;
  }

  goToDetails(route: any, row: any) {
    console.log(route, row)
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

    const isUser = !!event.userType;

    if (!isUser) {
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
    }

    /* this.tableService.sendRowSelected(this.mySelection); */
  }

  onShowAttachments(data: any) {
    alert('Treba da se odradi servis i componenta za Attachments');
  }

  onShowItemDrop(index: number) {}

  onShowPassword(index: number) {
    this.loadingPassword = index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
