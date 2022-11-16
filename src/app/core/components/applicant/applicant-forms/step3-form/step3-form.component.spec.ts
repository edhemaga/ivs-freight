import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3FormComponent } from './step3-form.component';

describe('Step3FormComponent', () => {
  let component: Step3FormComponent;
  let fixture: ComponentFixture<Step3FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step3FormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step3FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
