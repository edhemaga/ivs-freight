import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierSearchTwoComponent } from './carrier-search-two.component';

describe('CarrierSearchTwoComponent', () => {
  let component: CarrierSearchTwoComponent;
  let fixture: ComponentFixture<CarrierSearchTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrierSearchTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrierSearchTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
