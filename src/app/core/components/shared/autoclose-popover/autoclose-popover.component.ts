import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
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
  @Output() closeFilter = new EventEmitter<any>();
  @Output() openFilter = new EventEmitter<any>();

  public tooltip: any;
  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {}

  switchTab(e, t2) {
    if (t2.isOpen()) {
      this.tooltip.close();
    } else {
      t2.open();
      this.tooltip = t2;
    }
  }

  onFilterClose() {
    if (this.closeFilter) {
      this.closeFilter.emit();
    }
  }

  onFilterShown() {
    if (this.openFilter) {
      this.openFilter.emit();
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
      event.target.closest('.user-frame') ||
      event.target.closest('.highlight-text-45632') ||
      event.target.closest('.user-main-holder') ||
      event.target.closest('.search-icon-holder') ||
      event.target.closest('.close-input-search') ||
      event.target.closest('.dropdown-option')
    ) {
    } else {
      this.tooltip && this.tooltip.close();
    }
  }
}
