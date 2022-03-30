import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconNewComponent } from './svg-icon-new.component';

describe('SvgIconNewComponent', () => {
  let component: SvgIconNewComponent;
  let fixture: ComponentFixture<SvgIconNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgIconNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
