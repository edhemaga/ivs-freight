import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosRulesComponent } from './hos-rules.component';

describe('HosRulesComponent', () => {
  let component: HosRulesComponent;
  let fixture: ComponentFixture<HosRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HosRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HosRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
