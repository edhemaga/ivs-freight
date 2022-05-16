import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDetailsItemComponent } from './truck-details-item.component';

describe('TruckDetailsItemComponent', () => {
  let component: TruckDetailsItemComponent;
  let fixture: ComponentFixture<TruckDetailsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckDetailsItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
