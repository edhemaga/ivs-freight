import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { card_modal_animation } from '../animations/card-modal.animation';

@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')]
})
export class TaReCardComponent implements OnInit {
  @Input() cardNameCommon:string;
  @Input() cardDocumentCounter:number;
  @Input() isCardOpen:boolean=true;
  @Input() hasSvg:string='';
  resPage:boolean=false;
  @Output() resizePage=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }
  public toggleCards(){
    this.isCardOpen = !this.isCardOpen;
  }
  public toggleResizePage(val:boolean){
    this.resPage= !this.resPage
    val=this.resPage;
    this.resizePage.emit(val);
    console.log(val);
    
  }
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
}
