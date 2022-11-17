/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtTitleModalComponent } from './tt-title-modal.component';

describe('TtTitleModalComponent', () => {
  let component: TtTitleModalComponent;
  let fixture: ComponentFixture<TtTitleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TtTitleModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtTitleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
