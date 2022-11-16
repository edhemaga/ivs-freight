import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaChartComponent } from './ta-chart.component';

describe('TaChartComponent', () => {
   let component: TaChartComponent;
   let fixture: ComponentFixture<TaChartComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [TaChartComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(TaChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
