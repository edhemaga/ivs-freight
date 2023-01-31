import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-website-resend-btn',
    templateUrl: './website-resend-btn.component.html',
    styleUrls: ['./website-resend-btn.component.scss'],
})
export class WebsiteResendBtnComponent implements OnInit {
    @Input() btnText: string = null;
    @Input() blueText: boolean = false;
    @Input() requestedResend?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    public onGetClickValue(): void {
        this.clickValueEmitter.emit({ notDisabledClick: true });
    }
}
