import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
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

  public toggleDrop() {
    this.toggleDropDown = !this.toggleDropDown;
  }
  public CloseCard(){
    let currentDate=moment().format('MM/DD/YYYY')
    if(moment(this.expDateClose).isBefore(currentDate)){
      this.isCardOpen=false
    }
  }
  public toggleCards() {
    let currentDate=moment().format('MM/DD/YYYY')
     if(moment(this.expDateClose).isBefore(currentDate)){
      this.isCardOpen = !this.isCardOpen;
    }
  }
  public toggleResizePage(val: any) {
    this.resPage = !this.resPage;
    val = this.resPage;
    this.resizePage.emit(val);
    console.log(val);
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
    this.toggleCards();

    
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
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
}
