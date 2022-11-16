import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Input,
} from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
    @Input() autoFocusDelay = 1000;
    @Input() dontDoFocus!: string;
    @Input() modalType!: string;

    constructor(private el: ElementRef, private cdRef: ChangeDetectorRef) {}

    ngAfterViewInit() {
        if (this.modalType == 'edit') {
            return;
        }
        if (this.dontDoFocus && this.dontDoFocus == 'true') {
            return;
        }
        setTimeout(() => {
            if (this.el.nativeElement.localName === 'kendo-datepicker') {
                this.el.nativeElement.children[0].children[0].children[0].children[0].focus();
            } else if (this.el.nativeElement.localName === 'ng-select') {
                this.el.nativeElement.children[0].children[0].children[1].children[0].focus();
            } else {
                this.el.nativeElement.focus();
            }
        }, this.autoFocusDelay);
        this.cdRef.detectChanges();
    }
}
