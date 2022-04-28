import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ta-details-header-card',
  templateUrl: './ta-details-header-card.component.html',
  styleUrls: ['./ta-details-header-card.component.scss']
})
export class TaDetailsHeaderCardComponent implements OnInit {
  
  @Input() cardDetailsName:string='';
  @Input() cardDetailsDate:string='';
  constructor() { }

  ngOnInit(): void {
    this.cardDetailsName='Unit 12345';
    this.cardDetailsDate='08/03/20';
  }

}
