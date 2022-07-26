import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-ta-copy',
  templateUrl: './ta-copy.component.html',
  styleUrls: ['./ta-copy.component.scss'],
})
export class TaCopyComponent implements OnInit {
  @Input() copyValue: string;
  @Input() textFontSize: string = '14px';
  @Input() textColor: string = '#6c6c6c';
  @Input() textFontWeight: string = '400';
  @Input() hasEye: boolean = false;
  @Output() showHideEye = new EventEmitter<any>();
  public textCopied: boolean;
  public isVisible: boolean;
  constructor(private clipboar: Clipboard) {}

  ngOnInit(): void {}

  /* To copy any Text */
  public copyText(val: any) {
    this.textCopied = true;
    this.clipboar.copy(val);
  }

  /**Show hide eye function */
  public showHide(event: any) {
    this.showHideEye.emit(event);
  }
}
