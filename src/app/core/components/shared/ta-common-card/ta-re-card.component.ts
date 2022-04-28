import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss']
})
export class TaReCardComponent implements OnInit {
  @Input() cardNameCommon:string;
  @Input() cardDocumentCounter:number;
  @Input() isCardOpen:boolean=true;
  @Input() hasSvg:string='';

  constructor() { }

  ngOnInit(): void {
  }
  public toggleCards(){
    this.isCardOpen = !this.isCardOpen;
  }
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
}
