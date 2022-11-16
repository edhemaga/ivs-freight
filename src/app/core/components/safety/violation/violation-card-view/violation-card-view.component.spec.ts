import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationCardViewComponent } from './violation-card-view.component';

describe('ViolationCardViewComponent', () => {
   let component: ViolationCardViewComponent;
   let fixture: ComponentFixture<ViolationCardViewComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [ViolationCardViewComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(ViolationCardViewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
