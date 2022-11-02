import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.scss'],
})
export class CustomScrollbarComponent implements OnInit, OnDestroy {
  @ViewChild('bar', { static: false }) private bar: ElementRef;
  scrollTop: number = 5;
  showScrollbar: boolean = false;
  scrollHeight: number = 0;
  scrollRatio: number = 0;
  scrollRatioFull: number = 0;

  isMouseDown: boolean = false;
  startingBarOffsetTop: number = 0;
  barClickPosition: number = 0;
  barClickRestHeight: number = 0;
  private destroy$ = new Subject<void>();
  calculateSizeHeightTimer: any;

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private sharedService: SharedService,
    private chng: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    let hasTablePageHeight = false;

    // this.sharedService.emitUpdateScrollHeight
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     hasTablePageHeight = res.tablePageHeight;

    //     this.calculateBarSizeAndPosition(
    //       this.elRef.nativeElement.children[0],
    //       res.tablePageHeight
    //     );
    //   });

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mouseup', () => {
        this.isMouseDown = false;
      });
      document.addEventListener('mousemove', (e) => {
        if (this.isMouseDown) {
          const offsetBar = e.clientY - this.barClickPosition;
          if (
            offsetBar > -1 &&
            e.clientY + this.barClickRestHeight < window.innerHeight
          ) {
            this.bar.nativeElement.style.transform = `translateY(${offsetBar}px)`;
          }
          this.elRef.nativeElement.children[0].scrollTop =
            (e.clientY - this.barClickPosition) * this.scrollRatioFull;

          if (hasTablePageHeight) {
            this.sharedService.emitTableScrolling.emit(
              (e.clientY - this.barClickPosition) * this.scrollRatioFull
            );
          }
        }
      });

      this.elRef.nativeElement.children[0].addEventListener(
        'scroll',
        this.setScrollEvent.bind(this)
      );
      window.addEventListener('resize', (e: any) => {
        if (!this.isMouseDown && !hasTablePageHeight)
          this.calculateBarSizeAndPosition(
            this.elRef.nativeElement.children[0]
          );
      });
    });
  }

  public setScrollEvent(e: any) {
    if (!this.isMouseDown)
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
  }

  setDraggingStart(e: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      this.elRef.nativeElement.children[0].removeEventListener(
        'scroll',
        this.setScrollEvent.bind(this)
      );
    });

    const style = window.getComputedStyle(this.bar.nativeElement);
    const matrix = new DOMMatrixReadOnly(style.transform);
    this.barClickPosition = e.clientY - matrix.m42;
    this.barClickRestHeight = this.scrollHeight - this.barClickPosition;
    this.isMouseDown = true;
  }

  calculateBarSizeAndPosition(elem: any, pageHeight?: number) {
    //this.chng.detectChanges();

    setTimeout(() => {
      const content_height = this.elRef.nativeElement.children[0].scrollHeight;
      const visible_height = window.innerHeight;

      this.showScrollbar = true;

      if (content_height <= visible_height) {
        this.showScrollbar = false;
        this.chng.detectChanges();
        return;
      }

      this.scrollRatio = visible_height / content_height;
      this.scrollRatioFull = content_height / visible_height;
      this.scrollTop = elem.scrollTop * this.scrollRatio;

      if (this.bar) {
        this.bar.nativeElement.style.transform = `translateY(${this.scrollTop}px)`;
      }

      this.scrollHeight = this.scrollRatio * visible_height;
      this.chng.detectChanges();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  projectContentChanged(e) {
    clearTimeout(this.calculateSizeHeightTimer);
    this.calculateSizeHeightTimer = setTimeout(() => {
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
    }, 100);
  }
}
