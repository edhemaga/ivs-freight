import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadCardsComponent } from './new-load-cards.component';

describe('NewLoadCardsComponent', () => {
  let component: NewLoadCardsComponent;
  let fixture: ComponentFixture<NewLoadCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoadCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoadCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
