import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaSwitchComponent} from './ta-switch.component';

describe('TaSwitchComponent', () => {
  let component: TaSwitchComponent;
  let fixture: ComponentFixture<TaSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaSwitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
