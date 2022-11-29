import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
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

    @ViewChild('fileSlider')
    fileSlider: ElementRef;
    @ViewChild('fileHolder')
    fileHolder: ElementRef;
    filesShown: number = 0;

    @Output() activeSlide: EventEmitter<number> = new EventEmitter<number>(
        null
    );

    public currentSlide: number = 0;

    // Multiple slides
    public multipleCurrentSlide: number = 0;
    @Input() slideWidth: number = 180;
    public translateXMultipleSlides: number = 0;

    public onAction(action: string) {
        switch (action) {
            case 'prev': {
                if (
                    this.customDetailsPageClass == 'todo-details' &&
                    this.files?.length == 3
                ) {
                    this.multipleCurrentSlide = 0;
                    this.translateXMultipleSlides = 0;

                    return;
                }

                const previous = this.currentSlide - 1;
                this.currentSlide =
                    previous < 0 ? this.files.length - 1 : previous;
                this.activeSlide.emit(this.currentSlide);
                // Multiple slides previous
                if (
                    ['medium', 'large', 'small'].includes(
                        this.customClass?.toLowerCase()
                    )
                ) {
                    if (this.multipleCurrentSlide < 0) {
                        this.filesShown = ['large'].includes(
                            this.customClass?.toLowerCase()
                        )
                            ? 3
                            : ['medium'].includes(
                                  this.customClass?.toLowerCase()
                              )
                            ? 2
                            : ['extraLarge'].includes(
                                  this.customClass?.toLowerCase()
                              )
                            ? 6
                            : 1;
                        this.multipleCurrentSlide =
                            this.files.length - this.filesShown;
                        this.translateXMultipleSlides = -(
                            this.fileSlider.nativeElement.clientWidth -
                            this.fileHolder.nativeElement.clientWidth
                        );
                        return;
                    } else {
                        this.multipleCurrentSlide--;
                        this.translateXMultipleSlides += this.slideWidth;
                        if (this.multipleCurrentSlide == 0) {
                            this.translateXMultipleSlides = 0;
                        }
                    }
                }
                break;
            }
            case 'next': {
                if (
                    this.customDetailsPageClass == 'todo-details' &&
                    this.files?.length == 3
                ) {
                    this.multipleCurrentSlide =
                        this.files.length - this.filesShown;
                    this.translateXMultipleSlides = -(
                        this.fileSlider.nativeElement.clientWidth -
                        this.fileHolder.nativeElement.clientWidth
                    );

                    return;
                }

                const next = this.currentSlide + 1;
                this.currentSlide = next === this.files.length ? 0 : next;
                this.activeSlide.emit(this.currentSlide);

                if (
                    ['medium', 'large', 'small', 'extraLarge'].includes(
                        this.customClass?.toLowerCase()
                    )
                ) {
                    this.filesShown = ['large'].includes(
                        this.customClass?.toLowerCase()
                    )
                        ? 4
                        : ['medium'].includes(this.customClass?.toLowerCase())
                        ? 3
                        : ['extraLarge'].includes(
                              this.customClass?.toLowerCase()
                          )
                        ? 7
                        : 2;
                    if (
                        this.multipleCurrentSlide >
                        this.files.length - this.filesShown
                    ) {
                        this.multipleCurrentSlide = 0;
                        this.translateXMultipleSlides = 0;
                        return;
                    } else {
                        this.multipleCurrentSlide++;
                        if (
                            this.multipleCurrentSlide >
                            this.files.length - this.filesShown
                        ) {
                            this.translateXMultipleSlides = -(
                                this.fileSlider.nativeElement.clientWidth -
                                this.fileHolder.nativeElement.clientWidth
                            );
                        } else {
                            this.translateXMultipleSlides -= this.slideWidth;
                        }
                    }
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public slideToFile(index: number) {
        this.currentSlide = index;
        this.multipleCurrentSlide = index;
        this.translateXMultipleSlides =
            this.slideWidth * -this.multipleCurrentSlide;
    }

    // TruckBy ngFor files changes
    public identity(index: number, item: any): number {
        return item.name;
    }
}
