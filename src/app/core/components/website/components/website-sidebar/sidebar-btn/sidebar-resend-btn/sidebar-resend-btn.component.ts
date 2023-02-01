import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-sidebar-resend-btn',
    templateUrl: './sidebar-resend-btn.component.html',
    styleUrls: ['./sidebar-resend-btn.component.scss'],
})
export class SidebarResendBtnComponent implements OnInit {
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
