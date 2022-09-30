import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-toolbar-filters',
  templateUrl: './toolbar-filters.component.html',
  styleUrls: ['./toolbar-filters.component.scss']
})
export class ToolbarFiltersComponent implements OnInit, OnChanges {
  @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
  @Input() options: any;
  @Input() activeTableData: any;

  constructor() { }

  // --------------------------------NgOnInit---------------------------------
  ngOnInit(): void {}

  // --------------------------------NgOnChanges---------------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.activeTableData?.firstChange && changes?.activeTableData) {
      this.activeTableData = changes.activeTableData.currentValue;
    }
  }

  changeModeView(modeView: string){
    this.options.toolbarActions.viewModeOptions = this.options.toolbarActions.viewModeOptions.map((viewMode: any) => {
      viewMode.active = viewMode.name === modeView;

      return viewMode;
    })

    this.toolbarFilter.emit({
      mode: modeView,
    });
  }
}
