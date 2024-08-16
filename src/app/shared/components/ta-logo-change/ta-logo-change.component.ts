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
import { Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// modules
import { ImageCroppedEvent, ImageCropperModule, LoadedImage } from 'ngx-image-cropper';
import Croppie from 'croppie';

// services
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

// bootstrap
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaUploadDropzoneComponent } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// pipe
import { LogoSliderPipe } from '@shared/components/ta-logo-change/pipes/logo-slider.pipe';

// models
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ta-logo-change',
    templateUrl: './ta-logo-change.component.html',
    styleUrls: ['./ta-logo-change.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ImageCropperModule,
       // CroppieModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,

        // Component
        TaAppTooltipV2Component,
        TaUploadDropzoneComponent,
        TaNgxSliderComponent,

        // pipes
        LogoSliderPipe,
    ],
})
export class TaLogoChangeComponent
    implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();

    @ViewChild('croppie') croppieDirective: any | any; //CroppieDirective
    @Input() croppieOptions: Croppie.CroppieOptions = {
        // Rectangle Cropper Options - all the same except Viewport width - boundary width 616, enforceBoundary: false
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
    @Input() croppieShape: string;
    @Input() customClass: string;
    @Input() imageUrl: any | string = null;
    @Input() dropZoneConfig: DropZoneConfig = {
        dropZoneType: 'image',
        dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
        dropZoneSvg: 'assets/svg/common/drag-image-dropzone.svg',
        multiple: false,
        globalDropZone: false,
    };
    @Input() displayUploadZone?: boolean;

    @Output() validationEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>(false);
    @Output() base64ImageEvent: EventEmitter<string> =
        new EventEmitter<string>();

    @Output() saveLogoEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
        false
    );

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



    imageChangedEvent: any = '';
    croppedImage: any = '';

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
    }

    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.croppieShape !== 'rectangle') {
            const timeout = setTimeout(() => {
                this.imageUrl = changes.imageUrl?.currentValue
                    ? this.imageBase64Service.sanitizer(
                          changes.imageUrl.currentValue
                      )
                    : null;

                clearTimeout(timeout);
            }, 150);
        }

        if (this.croppieShape === 'rectangle') {
            if (
                changes.imageUrl?.previousValue !==
                changes.imageUrl?.currentValue
            ) {
                this.imageUrl = this.imageBase64Service.sanitizer(
                    changes.imageUrl.currentValue
                );

                this.showUploadZone = false;
            }

            if (
                !changes.imageUrl?.currentValue ||
                changes.displayUploadZone?.currentValue
            ) {
                this.imageUrl = null;

                this.showUploadZone = true;
            }
        }
    }

    ngOnInit(): void {
        this.uploadFileService.uploadedFiles$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: { files: UploadFile[]; action: string }) => {
                if (data) {
                    this.onUploadImage(data);
                }
            });

        if (this.croppieShape === 'rectangle' && this.imageUrl) {
            this.showUploadZone = false;

            this.saveLogoEvent.emit(true);
        }
    }

    public ngAfterViewInit() {
        if (this.imageUrl) {
            this.croppieDirective.croppie.bind({
                url: this.imageUrl.changingThisBreaksApplicationSecurity,
                points: [188, 101, 260, 191],
                zoom: this.imageScale,
            });

            this.showUploadZone =
                this.croppieShape === 'rectangle' ? false : true;
        }
    }

    public onUploadImage(event: any) {
        console.log(event);
        this.imageChangedEvent = event.files[0].url;
        if (this.showUploadZone) {
            this.showUploadZone = false; 
            this.imageUrl = null;

            const url = event.files[0].url;

            // this.croppieDirective.croppie.bind({
            //     url: url as string,
            //     points: [188, 101, 260, 191],
            //     zoom: this.imageScale,
            // });

            this.isImageValid = false;
            this.validationEvent.emit(this.isImageValid);
        }
    }

    public handleCroppieUpdate() {
        this.ngxSliderPosition = 0;
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

            this.showUploadZone = this.croppieShape !== 'rectangle';
        });

        this.isImageValid = true;
        this.validationEvent.emit(this.isImageValid);

        if (this.croppieShape === 'rectangle') {
            this.saveLogoEvent.emit(true);
        }
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
