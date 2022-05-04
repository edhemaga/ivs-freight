import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCardComponent } from './broker-card.component';

describe('BrokerCardComponent', () => {
  let component: BrokerCardComponent;
  let fixture: ComponentFixture<BrokerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
