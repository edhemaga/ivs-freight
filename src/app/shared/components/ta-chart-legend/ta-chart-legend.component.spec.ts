import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaChartLegendComponent } from './ta-chart-legend.component';

describe('TaChartLegendComponent', () => {
  let component: TaChartLegendComponent;
  let fixture: ComponentFixture<TaChartLegendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaChartLegendComponent]
    });
    fixture = TestBed.createComponent(TaChartLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
