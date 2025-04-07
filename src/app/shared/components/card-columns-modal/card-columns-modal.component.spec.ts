import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardColumnsModalComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

describe('CardColumnsModalComponent', () => {
  let component: CardColumnsModalComponent;
  let fixture: ComponentFixture<CardColumnsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardColumnsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardColumnsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
