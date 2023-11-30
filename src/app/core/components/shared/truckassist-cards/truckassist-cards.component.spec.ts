import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistCardsComponent } from './truckassist-cards.component';

describe('TruckassistCardsComponent', () => {
  let component: TruckassistCardsComponent;
  let fixture: ComponentFixture<TruckassistCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckassistCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckassistCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
