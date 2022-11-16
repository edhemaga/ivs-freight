import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputArrowsComponent } from './ta-input-arrows.component';

describe('TaInputArrowsComponent', () => {
  let component: TaInputArrowsComponent;
  let fixture: ComponentFixture<TaInputArrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaInputArrowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaInputArrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
