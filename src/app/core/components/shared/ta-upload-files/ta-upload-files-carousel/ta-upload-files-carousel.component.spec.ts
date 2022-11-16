/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaUploadFilesCarouselComponent } from './ta-upload-files-carousel.component';

describe('TaUploadFilesCarouselComponent', () => {
  let component: TaUploadFilesCarouselComponent;
  let fixture: ComponentFixture<TaUploadFilesCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaUploadFilesCarouselComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaUploadFilesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
