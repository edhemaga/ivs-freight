import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import moment from 'moment';
import { card_component_animation } from '../animations/card-component.animations';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class TaReCardComponent implements OnInit, OnChanges {
  @Input() public cardNameCommon: string;
  @Input() public cardDocumentCounter: number;
  @Input() public isCardOpen: boolean = true;
  @Input() public hasSvg: string = '';
  @Input() public options: any = [];
  @Input() public hasCopyIcon: boolean = false;
  @Input() public expDateClose: any;
  @Input() public hasFooter: boolean = true;
  @Input() public settingsIcon: boolean = false;
  @Input() public haveHeaderText: boolean = false;
  @Input() public haveDots: boolean = true;
  @Output() resizePage = new EventEmitter<boolean>();
  @Input() public animationsDisabled = false;
  @Input() public stateNameShort: string = '';
  @Input() public stateNameLong: string = '';
  @Input() public optionsId: number;
  @Input() public shortName: string = '';
  @Input() public stateTooltipName: string = '';
  @Input() public cardSecondName: string = '';
  @Output() public dropActions = new EventEmitter<any>();
  @Input() public weeklyWidth: string = '';
  @Input() public setPositionDrop:boolean;
  @Input() isDeactivated: any;
  public resPage: boolean = false;
  public copiedCommon: boolean = false;
  public toggleDropDown: boolean;
  constructor(private clipboard:Clipboard) {}
  ngOnChanges(changes: SimpleChanges): void {    
  }
  ngOnInit(): void {
    this.CloseCard();
  }

  public CloseCard() {
    let currentDate = moment().format('MM/DD/YYYY');
    if (moment(this.expDateClose).isBefore(currentDate) || this.isDeactivated) {
      this.isCardOpen = false;
    }    
  }

  public toggleCard(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let currentDate = moment().format('MM/DD/YYYY');
    if (moment(this.expDateClose).isBefore(currentDate) || this.isDeactivated) {
      this.isCardOpen = !this.isCardOpen;
    }
  }
  public onAction(val: string, res: any) {
    switch (val) {
      case 'resize':
        this.resPage = !this.resPage;
        this.resizePage.emit(this.resPage);
        break;
    }
  }
  /**Function for drop acitons */
  public dropAct(action: any) {
    this.dropActions.emit(action);
  }
  /* To copy any Text */
  public copyText(val: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.copiedCommon = true;
   this.clipboard.copy(val);
  }
}
