import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { card_modal_animation } from '../animations/card-modal.animation';

@Component({
  selector: 'app-ta-re-card',
  templateUrl: './ta-re-card.component.html',
  styleUrls: ['./ta-re-card.component.scss'],
  animations: [card_modal_animation('showHideCardBody')],
})
export class TaReCardComponent implements OnInit {
  @Input() cardNameCommon: string;
  @Input() cardDocumentCounter: number;
  @Input() isCardOpen: boolean = true;
  @Input() hasSvg: string = '';
  @Input() options: any = [];
  @Input() hasCopyIcon:boolean=false;
  @Output() resizePage = new EventEmitter<boolean>();
  public resPage: boolean = false;
  public copied: boolean = false;
  public toggleDropDown: boolean;
  constructor() {}

  ngOnInit(): void {}

  public toggleDrop() {
    this.toggleDropDown = !this.toggleDropDown;
  }
  public toggleCards() {
    this.isCardOpen = !this.isCardOpen;
  }
  public toggleResizePage(val: boolean) {
    this.resPage = !this.resPage;
    val = this.resPage;
    this.resizePage.emit(val);
    console.log(val);
  }
  /* To copy any Text */
  public copyText(val: any) {
    this.copied = true;
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
