import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ta-details-header',
  templateUrl: './ta-details-header.component.html',
  styleUrls: ['./ta-details-header.component.scss'],
})
export class TaCommonHeaderComponent {
  @Input() headerText:string=null;
  @Input() tooltipHeaderName:string='';
  @Input() route:string='';
  @Input() options:any=[];
  @Output() openModalAction =new EventEmitter<string>();


  openModal(val:any){
    this.openModalAction.emit(val);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
