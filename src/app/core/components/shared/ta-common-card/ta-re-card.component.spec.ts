import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaReCardComponent } from './ta-re-card.component';

describe('TaReCardComponent', () => {
  let component: TaReCardComponent;
  let fixture: ComponentFixture<TaReCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaReCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaReCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
