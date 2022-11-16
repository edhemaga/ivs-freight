import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputrestriction]',
})
export class InputRestrictionDirective {
  @Input('appInputrestriction') InputRestriction: string;

  private element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  @HostListener('keydown', ['$event'])
  handleKeywodn(event: KeyboardEvent) {
    if (
      event.key == 'Tab' ||
      event.key == 'Shift' ||
      event.key == 'Backspace' ||
      event.key == 'Delete' ||
      event.key == 'ArrowRight' ||
      event.key == 'ArrowLeft'
    ) {
      return true;
    }
    const regex = new RegExp(this.InputRestriction);
    // tslint:disable-next-line: deprecation
    const str = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (regex.test(str)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
