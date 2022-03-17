import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-truckassist-table-toolbar',
  templateUrl: './truckassist-table-toolbar.component.html',
  styleUrls: ['./truckassist-table-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TruckassistTableToolbarComponent implements OnInit, OnChanges {
  @Input() options: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }
    
    console.log('Toolbar Options');
    console.log(this.options);
  }
}
