import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-sidebar-resend-btn',
    templateUrl: './sidebar-resend-btn.component.html',
    styleUrls: ['./sidebar-resend-btn.component.scss'],
    animations: [
        trigger('displaySentContainer', [
            transition(':enter', [
                style({ opacity: 0, visibility: 'hidden' }),
                animate(
                    '0.2s ease-in-out',
                    style({ opacity: 1, visibility: 'visible' })
                ),
            ]),
        ]),
    ],
})
export class SidebarResendBtnComponent implements OnInit, OnChanges {
    @Input() btnText: string = null;
    @Input() blueText?: boolean = false;
    @Input() requestedResend?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<any>();

    public sentAgoCounter: number = 0;

    public sentAgoBtnDisabled: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.requestedResend?.currentValue) {
            this.startSentAgoCounter();
        }
    }

    public onGetClickValue(): void {
        if (this.sentAgoBtnDisabled) {
            return;
        }

        this.clickValueEmitter.emit({ notDisabledClick: true });

        this.sentAgoBtnDisabled = true;
    }

    private startSentAgoCounter(): void {
        let counter = 0;

        const sentAgoInterval = setInterval(() => {
            counter++;

            if (counter === 5) {
                this.sentAgoCounter++;

                counter = 0;

                if (this.sentAgoCounter % 5 === 0) {
                    this.sentAgoBtnDisabled = false;
                }
            }

            if (this.sentAgoCounter === 30) {
                clearInterval(sentAgoInterval);
            }
        }, 1000);
    }
}
