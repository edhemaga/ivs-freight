import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appPreventMultipleclicks]',
  standalone: true,
})

export class PreventMultipleclicksDirective {
  private isActionInProgress = false;

  @Input() cooldownDuration = 300;

  @Output() cooldownComplete = new EventEmitter<void>(); 

  @HostListener('click', ['$event'])
  
  public onAction(event: Event): void {
    if (this.isActionInProgress) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.isActionInProgress = true;
    this.cooldownComplete.emit(); 

    setTimeout(() => {
      this.isActionInProgress = false;
    }, this.cooldownDuration);
    
  }
}
