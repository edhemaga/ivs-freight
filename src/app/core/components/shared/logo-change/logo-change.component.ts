import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation,} from '@angular/core';
import * as Croppie from 'croppie';
import {CroppieDirective} from 'angular-croppie-module';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-logo-change',
  templateUrl: './logo-change.component.html',
  styleUrls: ['./logo-change.component.scss']
})
export class LogoChangeComponent implements OnInit, AfterViewInit {
  @Input() src: string;
  @Output()
  saveAvatar: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  cancel: EventEmitter<string> = new EventEmitter<string>();
  // croppie
  public croppedImage = '';
  @ViewChild('croppie')
  public croppieDirective: CroppieDirective | any;
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
  // dropzone
  public showDropzone = true;
  public uploadedImageFile: any = null;
  public files: File[] = [];
  // slider
  public slideInit = 0.75;
  public options: Options = {
    floor: 0,
    ceil: 1.5,
    step: 0.0001,
    animate: false,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public scale = 0.75;
  avatarError = false;
  showUploadZone = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit() {
    if (this.src) {
      this.croppieDirective.croppie.bind({
        url: this.src,
        points: [188, 101, 260, 191],
        zoom: 0,
      });

      this.slideInit = 0;
      this.showDropzone = false;
    }
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);

    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.croppieDirective.croppie.bind({
        url: reader.result as string,
        points: [188, 101, 260, 191],
        zoom: this.scale,
      });
      this.showDropzone = false;
    };
  }

  public handleUpdate(event) {
    this.slideInit = event.zoom;
  }

  public zooming(event: any) {
    this.scale = event ? event : 0.1;
    this.croppieDirective.croppie.setZoom(this.scale);
  }

  public saveImage() {
    this.croppieDirective.croppie.result('base64').then((base64) => {
      this.croppedImage = base64;
      this.avatarError = false;
      this.saveAvatar.emit(base64);
    });
  }

  public onRemove() {

    if (this.src) {
      this.cancel.emit();
      this.showDropzone = false;
    } else {
      this.files = [];
      this.showDropzone = true;
      /* this.cancel.emit(); */
    }
  }

  public editProfileImage() {
    this.showUploadZone = true;
  }
}
