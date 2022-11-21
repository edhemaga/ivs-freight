import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTooltipComponent } from './app-tooltip.component';

describe('AppTooltipComponent', () => {
  let component: AppTooltipComponent;
  let fixture: ComponentFixture<AppTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppTooltipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
