import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomDatetimePickersComponent} from './custom-datetime-pickers.component';

describe('CustomDatetimePickersComponent', () => {
  let component: CustomDatetimePickersComponent;
  let fixture: ComponentFixture<CustomDatetimePickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDatetimePickersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatetimePickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
