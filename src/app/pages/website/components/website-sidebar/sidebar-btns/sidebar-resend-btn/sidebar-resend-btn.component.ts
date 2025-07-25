import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

// animations
import { websiteFadeInAnimation } from '@pages/website/animations/website-fade-in.animation';

@Component({
    selector: 'app-sidebar-resend-btn',
    templateUrl: './sidebar-resend-btn.component.html',
    styleUrls: ['./sidebar-resend-btn.component.scss'],
    animations: [websiteFadeInAnimation()],
})
export class SidebarResendBtnComponent implements OnChanges {
    @Input() btnText: string = null;
    @Input() requestedResend?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<{
        notDisabledClick: boolean;
    }>();
    @Output() resetRequestedResendEmitter = new EventEmitter<boolean>();

    public sentAgoCounter: number = 0;

    public sentAgoBtnDisabled: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.requestedResend?.currentValue) this.startSentAgoCounter();
    }

    public onGetClickValue(): void {
        if (this.sentAgoBtnDisabled) return;

        this.clickValueEmitter.emit({ notDisabledClick: true });

        this.sentAgoBtnDisabled = true;
    }

    private startSentAgoCounter(): void {
        let counter = 0;

        const sentAgoInterval = setInterval(() => {
            counter++;

            if (counter === 60) {
                this.sentAgoCounter++;

                counter = 0;

                if (this.sentAgoCounter % 5 === 0) {
                    this.sentAgoBtnDisabled = false;

                    this.resetRequestedResendEmitter.emit(true);

                    this.sentAgoCounter = 0;

                    clearInterval(sentAgoInterval);
                }
            }

            if (this.sentAgoCounter === 30) clearInterval(sentAgoInterval);
        }, 1000);
    }
}
