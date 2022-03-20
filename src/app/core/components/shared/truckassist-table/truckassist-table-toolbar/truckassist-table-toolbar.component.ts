import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-truckassist-table-toolbar',
  templateUrl: './truckassist-table-toolbar.component.html',
  styleUrls: ['./truckassist-table-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckassistTableToolbarComponent implements OnInit, OnChanges {
  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges in Table Toolbar');
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.tableData = changes.tableData.currentValue;
    }

    if (!changes?.selectedTab?.firstChange && changes?.selectedTab) {
      this.selectedTab = changes.selectedTab.currentValue;
    }

    console.log(this.options);
    console.log(this.tableData);
    console.log(this.selectedTab);
  }

  onSelectTab(selectedTabData: any) {
    this.toolBarAction.emit({
      action: 'tab-selected',
      tabData: selectedTabData
    });
  }

  onToolBarAction(actionType: string) {
    this.toolBarAction.emit({
      action: actionType,
    });
  }
}
