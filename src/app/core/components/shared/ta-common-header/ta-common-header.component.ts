import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ta-common-header',
  templateUrl: './ta-common-header.component.html',
  styleUrls: ['./ta-common-header.component.scss'],
})
export class TaCommonHeaderComponent implements OnInit {
  @Input() commonHeaderText:any='';
  @Input() detailsHeaderText:any;
  @Input() detailsTemplate:string='';
  @Output('openModal') openModalAction=new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void { 
    
  }
  
  openModal(){
    this.openModalAction.emit();
  }
}
