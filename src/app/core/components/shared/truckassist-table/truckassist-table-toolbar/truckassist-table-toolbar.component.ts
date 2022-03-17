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
  @Input() options: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }
  }

  onToolBarAction(actionType: string){
    this.toolBarAction.emit({
      action: actionType
    })
  }
}
