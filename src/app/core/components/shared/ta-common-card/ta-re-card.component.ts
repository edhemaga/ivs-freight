import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
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
export class TaReCardComponent implements OnInit {
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
  @Input() public setPositionDrop: boolean;
  @Input() isDeactivated: any;
  @Input() noteIcons: string = '';
  public resPage: boolean = false;
  public copiedCommon: boolean = false;
  public toggleDropDown: boolean;
  constructor(private clipboard: Clipboard, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.CloseCard();
    console.log('dataTest', this.options);
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

  public resizePageFun(val: any) {
    this.resPage = !this.resPage;
    this.resizePage.emit(this.resPage);
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
