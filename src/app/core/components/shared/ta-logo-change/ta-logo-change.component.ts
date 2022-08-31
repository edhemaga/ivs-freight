import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import { ImageBase64Service } from './../../../utils/base64.image';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Croppie from 'croppie';
import { CroppieDirective } from 'angular-croppie-module';
import { Options } from '@angular-slider/ngx-slider';
import { UploadFile } from '../ta-upload-files/ta-upload-file/ta-upload-file.component';
import { DropZoneConfig } from '../ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ta-logo-change',
  templateUrl: './ta-logo-change.component.html',
  styleUrls: ['./ta-logo-change.component.scss'],
})
export class TaLogoChangeComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  private destroy$ = new Subject<void>();
  @ViewChild('croppie') croppieDirective: CroppieDirective | any;
  @Input() croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 162,
      height: 194,
      type: 'square',
    },
    boundary: {
      width: 456,
      height: 194,
    },
  };
  @Input() customClass: string;
  @Input() imageUrl: any | string = null;
  @Input() dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'image',
    dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
    dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
    multiple: false,
    globalDropZone: false,
  };

  @Output() validationEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  @Output() base64ImageEvent: EventEmitter<string> = new EventEmitter<string>();

  public showUploadZone = true;
  public imageScale = 0.5;

  // slider
  public ngxLogoOptions: Options = {
    floor: 0.1,
    ceil: 1.5,
    step: 0.1,
    animate: false,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public ngxSliderPosition = 0.5;

  public isImageValid: boolean = false;

  constructor(
    private uploadFileService: TaUploadFileService,
    private imageBase64Service: ImageBase64Service
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const timeout = setTimeout(() => {
      this.imageUrl = changes.imageUrl.currentValue
        ? this.imageBase64Service.sanitizer(changes.imageUrl.currentValue)
        : null;

      clearTimeout(timeout);
    }, 150);
  }

  ngOnInit(): void {
    this.uploadFileService.uploadedFiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { files: UploadFile[]; action: string }) => {
        if (data) {
          this.onUploadImage(data);
        }
      });
  }

  public ngAfterViewInit() {
    if (this.imageUrl) {
      this.croppieDirective.croppie.bind({
        url: this.imageUrl.changingThisBreaksApplicationSecurity,
        points: [188, 101, 260, 191],
        zoom: this.imageScale,
      });
      this.ngxSliderPosition = 0;
      this.showUploadZone = true;
    }
  }

  public onUploadImage(event: any) {
    this.showUploadZone = false;
    this.imageUrl = null;

    const url = event.files[0].url;

    this.croppieDirective.croppie.bind({
      url: url as string,
      points: [188, 101, 260, 191],
      zoom: this.imageScale,
    });

    this.isImageValid = false;
    this.validationEvent.emit(this.isImageValid);
  }

  public handleCroppieUpdate(event) {
    this.ngxSliderPosition = event.zoom;
  }

  public zooming(event: any) {
    this.imageScale = event ? event : 0.1;
    this.croppieDirective.croppie.setZoom(this.imageScale);
  }

  public saveImage() {
    this.croppieDirective.croppie.result('base64').then((base64) => {
      this.base64ImageEvent.emit(
        this.imageBase64Service.getStringFromBase64(base64)
      );
      this.imageUrl = base64;
      this.showUploadZone = true;
    });
    this.isImageValid = true;
    this.validationEvent.emit(this.isImageValid);
  }

  public onDeleteSavedImage() {
    this.showUploadZone = true;
    this.imageUrl = null;
    this.base64ImageEvent.emit(null);
  }

  public onCancel() {
    this.showUploadZone = true;
    this.imageUrl = null;
    this.isImageValid = true;
    this.validationEvent.emit(this.isImageValid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
