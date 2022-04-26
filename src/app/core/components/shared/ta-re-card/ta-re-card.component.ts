import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss']
})
export class TaReCardComponent implements OnInit {
  @Input() cardName:string='PR 365421';
  @Input() cardDocumentCounter:number=3;

  //TODO
  /*
  OPEN AND CLOSE CARD
  ng-content height and width
  
  */
  constructor() { }

  ngOnInit(): void {
  }
  
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
}
