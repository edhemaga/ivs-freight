/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaUploadDropzoneComponent } from './ta-upload-dropzone.component';

describe('TaUploadDropzoneComponent', () => {
   let component: TaUploadDropzoneComponent;
   let fixture: ComponentFixture<TaUploadDropzoneComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TaUploadDropzoneComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TaUploadDropzoneComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
