/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationModalComponent } from './violation-modal.component';

describe('ViolationModalComponent', () => {
  let component: ViolationModalComponent;
  let fixture: ComponentFixture<ViolationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViolationModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
