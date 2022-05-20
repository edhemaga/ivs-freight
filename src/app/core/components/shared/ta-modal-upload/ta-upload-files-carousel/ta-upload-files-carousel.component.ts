import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ta-upload-files-carousel',
  templateUrl: './ta-upload-files-carousel.component.html',
  styleUrls: ['./ta-upload-files-carousel.component.scss'],
})
export class TaUploadFilesCarouselComponent {
  @Input() filesLength: number;
  @Input() customClass: string;

  @Output() activeSlide: EventEmitter<number> = new EventEmitter<number>(null);

  public currentSlide: number = 0;

  // Multiple slides
  public multipleCurrentSlide: number = 0;
  public slideWidth: number = 180;
  public fullWidth = 0;
  public translateXMultipleSlides: number = 0;

  public onAction(action: string) {
    switch (action) {
      case 'prev': {
        const previous = this.currentSlide - 1;
        this.currentSlide = previous < 0 ? this.filesLength - 1 : previous;
        this.activeSlide.emit(this.currentSlide);
        console.log(this.customClass)
        // Multiple slides previous
        if (
          ['modal-medium', 'modal-large'].includes(
            this.customClass.toLowerCase()
          )
        ) {
          this.multipleCurrentSlide--;
          if (this.multipleCurrentSlide < 0) {
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
        this.currentSlide = next === this.filesLength ? 0 : next;
        this.activeSlide.emit(this.currentSlide);

        // Multiple slides previous
        if (
          ['modal-medium', 'modal-large'].includes(
            this.customClass.toLowerCase()
          )
        ) {
          this.multipleCurrentSlide++;

          if (this.multipleCurrentSlide >= this.filesLength - 1) {
            this.multipleCurrentSlide = this.filesLength - 2;
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
}
