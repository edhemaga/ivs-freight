import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appInputFocus]'
})
export class InputFocusDirective {
  constructor(
    private el: ElementRef
  ) {
  }

  @HostListener('focus') onFocus() {
    this.el.nativeElement.offsetParent.classList.add('field-focused');
  }

  @HostListener('blur') onBlur() {
    this.el.nativeElement.offsetParent.classList.remove('field-focused');
  }
}
