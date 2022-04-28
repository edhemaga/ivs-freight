import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaDetailsHeaderCardComponent } from './ta-details-header-card.component';

describe('TaDetailsHeaderCardComponent', () => {
  let component: TaDetailsHeaderCardComponent;
  let fixture: ComponentFixture<TaDetailsHeaderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaDetailsHeaderCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaDetailsHeaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
