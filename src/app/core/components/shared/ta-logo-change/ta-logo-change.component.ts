import { TaUploadFileService } from './../ta-modal-upload/ta-upload-file.service';
import {
  createBase64,
  getStringFromBase64,
} from './../../../utils/base64.image';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as Croppie from 'croppie';
import { CroppieDirective } from 'angular-croppie-module';
import { Options } from '@angular-slider/ngx-slider';
import { DomSanitizer } from '@angular/platform-browser';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UploadFile } from '../ta-modal-upload/ta-upload-file/ta-upload-file.component';

@Component({
  selector: 'app-ta-logo-change',
  templateUrl: './ta-logo-change.component.html',
  styleUrls: ['./ta-logo-change.component.scss'],
})
export class TaLogoChangeComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() imageUrl: string;
  @Input() customClass: string;
  @Output() base64ImageEvent: EventEmitter<string> = new EventEmitter<string>();

  // croppie
  @ViewChild('croppie') croppieDirective: CroppieDirective | any;
  public croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 228,
      height: 144,
      type: 'square',
    },
    boundary: {
      width: 456,
      height: 144,
    },
  };
  public imageScale = 0.5;

  // dropzone
  public showUploadZone = true;

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

  // upload file
  public file: any;
  public savedFile: any = null;

  constructor(
    private sanitizer: DomSanitizer,
    private uploadFileService: TaUploadFileService
  ) {}

  ngOnInit(): void {
    this.uploadFileService.uploadedFiles$
      .pipe(untilDestroyed(this))
      .subscribe((data: { files: UploadFile[]; action: string }) => {
        if (data) {
          this.onSelect(data);
        }
      });
  }

  public get ngxSliderClass() {
    return `custom-slider-logo-change ${this.customClass}`;
  }

  public ngAfterViewInit() {
    if (this.imageUrl) {
      this.croppieDirective.croppie.bind({
        url: this.imageUrl,
        points: [188, 101, 260, 191],
        zoom: 0,
      });
      this.ngxSliderPosition = 0;
      this.showUploadZone = false;
    }
  }

  public onSelect(event: any) {
    const url = event.files[0].url;
    this.showUploadZone = false;
    const timeout = setTimeout(() => {
      this.croppieDirective.croppie.bind({
        url: url as string,
        points: [188, 101, 260, 191],
        zoom: this.imageScale,
      });
      clearTimeout(timeout);
    }, 200);
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
      this.base64ImageEvent.emit(getStringFromBase64(base64));
      this.savedFile = this.sanitizer.bypassSecurityTrustUrl(
        createBase64(getStringFromBase64(base64))
      );
      this.showUploadZone = false;
    });
  }

  public onDeleteSavedImage() {
    this.showUploadZone = true;
    this.savedFile = null;
    this.base64ImageEvent.emit(null);
  }

  public onCancel() {
    this.showUploadZone = true;
  }

  ngOnDestroy(): void {}
}
