import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-website-confirm-btn',
    templateUrl: './website-confirm-btn.component.html',
    styleUrls: ['./website-confirm-btn.component.scss'],
})
export class WebsiteConfirmBtnComponent implements OnInit {
    @Input() disabledValue?: boolean = false;
    @Input() loginBtn?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    public onGetClickValue(): void {
        this.clickValueEmitter.emit({ notDisabledClick: true });
    }
}
