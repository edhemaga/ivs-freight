import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import { ImageBase64Service } from '../../../utils/base64.image';
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
import Croppie from 'croppie';
import { CroppieDirective, CroppieModule } from 'angular-croppie-module';
import { Options } from '@angular-slider/ngx-slider';
import { UploadFile } from '../ta-upload-files/ta-upload-file/ta-upload-file.component';
import {
    DropZoneConfig,
    TaUploadDropzoneComponent,
} from '../ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TaNgxSliderComponent } from '../ta-ngx-slider/ta-ngx-slider.component';
import { LogoSliderPipe } from './logoSlider.pipe';

@Component({
    selector: 'app-ta-logo-change',
    templateUrl: './ta-logo-change.component.html',
    styleUrls: ['./ta-logo-change.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
        CroppieModule,

        // Component
        AppTooltipComponent,
        TaUploadDropzoneComponent,
        TaNgxSliderComponent,

        // Pipe
        LogoSliderPipe,
    ],
})
export class TaLogoChangeComponent
    implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();

    @ViewChild('croppie') croppieDirective: CroppieDirective | any;
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
        dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
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
        if (this.showUploadZone) {
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
