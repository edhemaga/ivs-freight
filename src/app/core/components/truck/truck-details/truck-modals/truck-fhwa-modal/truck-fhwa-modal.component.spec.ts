import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckFhwaModalComponent } from './truck-fhwa-modal.component';

describe('TruckFhwaModalComponent', () => {
  let component: TruckFhwaModalComponent;
  let fixture: ComponentFixture<TruckFhwaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckFhwaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckFhwaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
