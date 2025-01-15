import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMaskModule } from 'ngx-mask';

import { ObserversModule } from '@angular/cdk/observers';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        NgbModule,
        RouterModule,
        AngularSvgIconModule.forRoot(),
        NgxSliderModule,
        DragDropModule,
        ScrollingModule,
        NgxMaskModule.forRoot(),
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
        DragDropModule,
        ScrollingModule,
        NgxMaskModule,
        NgxSliderModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
})
export class SharedModule {}
