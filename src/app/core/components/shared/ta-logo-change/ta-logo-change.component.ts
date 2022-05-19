import { createBase64, getStringFromBase64 } from './../../../utils/base64.image';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as Croppie from 'croppie';
import { CroppieDirective } from 'angular-croppie-module';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-ta-logo-change',
  templateUrl: './ta-logo-change.component.html',
  styleUrls: ['./ta-logo-change.component.scss'],
})
export class TaLogoChangeComponent implements AfterViewInit {
  @Input() imageUrl: string;
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

  public async onSelect(event: any) {
    this.file = event.addedFiles[0];
    const url = await this.drawImage(this.file);

    this.croppieDirective.croppie.bind({
      url: url as string,
      points: [188, 101, 260, 191],
      zoom: this.imageScale,
    });
  }

  public async drawImage(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.showUploadZone = false;
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
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
      this.savedFile = createBase64(getStringFromBase64(base64));
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
}
