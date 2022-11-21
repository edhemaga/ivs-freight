/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckModalComponent } from './truck-modal.component';

describe('TruckModalComponent', () => {
  let component: TruckModalComponent;
  let fixture: ComponentFixture<TruckModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TruckModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
