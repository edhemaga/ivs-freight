import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-details-header',
  templateUrl: './ta-details-header.component.html',
  styleUrls: ['./ta-details-header.component.scss'],
})
export class TaCommonHeaderComponent implements OnInit {
  @Input() headerText: string = null;
  @Input() tooltipHeaderName: string = '';
  @Input() route: string = '';
  @Input() options: any = [];
  @Input() counterData: any;
  @Output('openModal') openModalAction = new EventEmitter<any>();
  @Input() hasIcon:boolean=false;
  @Input() hasDateArrow:boolean=false;
  constructor(private routes: ActivatedRoute) {}

  ngOnInit(): void {}

 
  openModal(val: any) {
    console.log(val);
    this.openModalAction.emit(val);
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
