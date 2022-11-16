import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step6FormComponent } from './step6-form.component';

describe('Step6FormComponent', () => {
   let component: Step6FormComponent;
   let fixture: ComponentFixture<Step6FormComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [Step6FormComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(Step6FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
