import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherParkingComponent } from './dispatcher-parking.component';

describe('DispatcherParkingComponent', () => {
   let component: DispatcherParkingComponent;
   let fixture: ComponentFixture<DispatcherParkingComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [DispatcherParkingComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(DispatcherParkingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
