import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { card_component_animation } from '../animations/card-component.animations';

@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class TaReCardComponent implements OnInit {
  @Input() public cardNameCommon: string;
  @Input() public cardDocumentCounter: number;
  @Input() public isCardOpen: boolean = true;
  @Input() public hasSvg: string = '';
  @Input() public options: any = [];
  @Input() public hasCopyIcon:boolean=false;
  @Input() public expDateClose:string='';
  @Input() public hasFooter:boolean=true;
  @Input() public settingsIcon:boolean=false;
  @Input() public haveHeaderText:boolean=false;
  @Input() public haveDots:boolean=true;
  @Output() resizePage = new EventEmitter<boolean>();
  @Input() public animationsDisabled = false;
  @Input() public stateNameShort:string='';
  @Input() public stateNameLong:string='';
  @Input() public optionsId:number;
  @Input() public shortName:string='';
  @Input() public stateTooltipName:string='';
  @Input() public cardSecondName:string='';
  @Output() public dropActions = new EventEmitter<any>();
  public resPage: boolean = false;
  public copied: boolean = false;
  public toggleDropDown: boolean;
  constructor() {}

  ngOnInit(): void {
    this.CloseCard();
  }

  public CloseCard(){
    let currentDate=moment().format('MM/DD/YYYY')
    if(moment(this.expDateClose).isBefore(currentDate)){
      this.isCardOpen=false
    }
  }
  public onAction(val:string){
      switch(val){
        case 'resize':
          this.resPage = !this.resPage;
          this.resizePage.emit(this.resPage);
          break;
        case 'toggle-card':
          let currentDate=moment().format('MM/DD/YYYY')
          if(moment(this.expDateClose).isBefore(currentDate)){
           this.isCardOpen = !this.isCardOpen;
         }
         break;
      }
  }
  /**Function for drop acitons */
  public dropAct(action:any){
    this.dropActions.emit(action);
  }
  /* To copy any Text */
  public copyText(val: any) {
    this.copied = true;
    setTimeout(() => {
      this.copied=false;
    }, 2200);    
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
