import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ta-details-header',
  templateUrl: './ta-details-header.component.html',
  styleUrls: ['./ta-details-header.component.scss'],
})
export class TaCommonHeaderComponent implements OnInit {
  @Input() headerText:string=null;
  @Input() tooltipHeaderName:string='';
  @Input() route:string='';
  @Output('openModal') openModalAction=new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void { 
  }
  
  openModal(val:any){
    console.log(val);
    this.openModalAction.emit(val);
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
