import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5FormComponent } from './step5-form.component';

describe('Step5FormComponent', () => {
   let component: Step5FormComponent;
   let fixture: ComponentFixture<Step5FormComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [Step5FormComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(Step5FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
