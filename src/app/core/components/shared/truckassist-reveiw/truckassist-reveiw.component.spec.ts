import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistReveiwComponent } from './truckassist-reveiw.component';

describe('TruckassistReveiwComponent', () => {
  let component: TruckassistReveiwComponent;
  let fixture: ComponentFixture<TruckassistReveiwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckassistReveiwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistReveiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
