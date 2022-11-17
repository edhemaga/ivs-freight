import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-ta-upload-files-carousel',
    templateUrl: './ta-upload-files-carousel.component.html',
    styleUrls: ['./ta-upload-files-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaUploadFilesCarouselComponent {
    @Input() files: any[];
    @Input() customClass: string;
    @Input() customDetailsPageClass: string;
    @Input() hasCarouselBottomTabs: boolean;

    @Output() activeSlide: EventEmitter<number> = new EventEmitter<number>(
        null
    );

    public currentSlide: number = 0;

    // Multiple slides
    public multipleCurrentSlide: number = 0;
    public slideWidth: number = 180;
    public translateXMultipleSlides: number = 0;

    public onAction(action: string) {
        switch (action) {
            case 'prev': {
                const previous = this.currentSlide - 1;
                this.currentSlide =
                    previous < 0 ? this.files.length - 1 : previous;
                this.activeSlide.emit(this.currentSlide);
                // Multiple slides previous
                if (
                    ['medium', 'large'].includes(
                        this.customClass?.toLowerCase()
                    )
                ) {
                    if (--this.multipleCurrentSlide <= 0) {
                        this.multipleCurrentSlide = 0;
                        return;
                    } else {
                        this.translateXMultipleSlides += this.slideWidth;
                    }
                }
                break;
            }
            case 'next': {
                const next = this.currentSlide + 1;
                this.currentSlide = next === this.files.length ? 0 : next;
                this.activeSlide.emit(this.currentSlide);

                // Multiple slides previous
                if (['medium'].includes(this.customClass?.toLowerCase())) {
                    if (++this.multipleCurrentSlide >= this.files.length - 1) {
                        this.multipleCurrentSlide = this.files.length - 1;

                        return;
                    } else {
                        this.translateXMultipleSlides -= this.slideWidth;
                    }
                }

                if (['large'].includes(this.customClass?.toLowerCase())) {
                    if (++this.multipleCurrentSlide >= this.files.length - 2) {
                        this.multipleCurrentSlide = this.files.length - 2;

                        return;
                    } else {
                        this.translateXMultipleSlides -= this.slideWidth;
                    }
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    // TruckBy ngFor files changes
    public identity(index: number, item: any): number {
        return item.name;
    }
}
