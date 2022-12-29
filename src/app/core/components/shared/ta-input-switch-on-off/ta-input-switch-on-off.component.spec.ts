import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputSwitchOnOffComponent } from './ta-input-switch-on-off.component';

describe('TaInputSwitchOnOffComponent', () => {
  let component: TaInputSwitchOnOffComponent;
  let fixture: ComponentFixture<TaInputSwitchOnOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaInputSwitchOnOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaInputSwitchOnOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
