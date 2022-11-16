import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistTableHeadComponent } from './truckassist-table-head.component';

describe('TruckassistTableHeadComponent', () => {
   let component: TruckassistTableHeadComponent;
   let fixture: ComponentFixture<TruckassistTableHeadComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [TruckassistTableHeadComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(TruckassistTableHeadComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
