import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomCardV2Component } from './ta-custom-card-v2.component';

describe('TaCustomCardV2Component', () => {
  let component: TaCustomCardV2Component;
  let fixture: ComponentFixture<TaCustomCardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaCustomCardV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCustomCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
