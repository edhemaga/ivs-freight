import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipSlideComponent } from './tooltip-slide.component';

describe('TooltipSlideComponent', () => {
  let component: TooltipSlideComponent;
  let fixture: ComponentFixture<TooltipSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TooltipSlideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
