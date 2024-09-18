import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';

//import { AgmDirectionModule } from 'agm-direction';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMaskModule } from 'ngx-mask';
//import { Ng5SliderModule } from 'ng5-slider';
//import { CroppieModule } from 'angular-croppie-module';

//import { PdfViewerModule } from 'ng2-pdf-viewer';

//import { ChartsModule } from 'ng2-charts';

//import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { ObserversModule } from '@angular/cdk/observers';
import { CarouselModule } from 'ngx-owl-carousel-o';
//import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        NgbModule,
        RouterModule,
        AngularSvgIconModule.forRoot(),
        AngularSvgIconPreloaderModule.forRoot({
            configUrl: 'assets/preload-svg/preload-svg.json',
        }),
        //AgmDirectionModule,
        NgxSliderModule,
        //GooglePlaceModule,
        DragDropModule,
        ScrollingModule,
        NgxMaskModule.forRoot(),
        //Ng5SliderModule,
        // NgxDropzoneModule,
        // CroppieModule,
        // PdfViewerModule,
        // ChartsModule,
        // AgmSnazzyInfoWindowModule,
        ObserversModule,
        CarouselModule,
    ],
    exports: [
        // modules
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        AngularSvgIconModule,
        NgbModule,
        //GooglePlaceModule,
        DragDropModule,
        ScrollingModule,
        NgxMaskModule,
        // Ng5SliderModule,
        // NgxDropzoneModule,
        // CroppieModule,
        NgxSliderModule,
        // PdfViewerModule,
        // AgmSnazzyInfoWindowModule,
        // AgmDirectionModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
  ],
})
export class SharedModule {}
