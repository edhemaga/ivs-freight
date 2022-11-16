import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDetailsComponent } from './fuel-details.component';

describe('FuelDetailsComponent', () => {
   let component: FuelDetailsComponent;
   let fixture: ComponentFixture<FuelDetailsComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [FuelDetailsComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(FuelDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
