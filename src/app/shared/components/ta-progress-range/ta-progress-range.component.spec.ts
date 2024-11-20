import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProgressRangeComponent } from './ta-progress-range.component';

describe('TaProgressRangeComponent', () => {
  let component: TaProgressRangeComponent;
  let fixture: ComponentFixture<TaProgressRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaProgressRangeComponent]
    });
    fixture = TestBed.createComponent(TaProgressRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
