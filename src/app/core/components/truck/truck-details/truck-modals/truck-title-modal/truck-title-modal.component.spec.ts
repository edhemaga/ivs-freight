import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTitleModalComponent } from './truck-title-modal.component';

describe('TruckTitleModalComponent', () => {
  let component: TruckTitleModalComponent;
  let fixture: ComponentFixture<TruckTitleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckTitleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTitleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
