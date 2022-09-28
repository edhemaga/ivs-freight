import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: '[app-autoclose-popover]',
  templateUrl: './autoclose-popover.component.html',
  styleUrls: ['./autoclose-popover.component.scss'],
})
export class AutoclosePopoverComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() customClass: string;
  @Input() placement: string = 'bottom-right';
  public tooltip: any;
  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {}

  switchTab(e, t2) {
   if ( t2.isOpen() ){
    this.tooltip.close();
   }else{
      t2.open();
      this.tooltip = t2;
   }
    
  }

  closeCustomPopover() {
    this.tooltip.close();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (
      this.eRef.nativeElement.contains(event.target) ||
      event.target.closest('.datetime-dropdown-holder') ||
      event.target.closest('.popover') ||
      event.target.closest('.selected-name-text') ||
      event.target.closest('.icon-delete') ||
      event.target.closest('.clear-money-form') ||
      event.target.closest('.user-frame')
      
    ) {
    } else {
      this.tooltip && this.tooltip.close();
    }
  }
}
