import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4FormComponent } from './step4-form.component';

describe('Step4FormComponent', () => {
  let component: Step4FormComponent;
  let fixture: ComponentFixture<Step4FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step4FormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
