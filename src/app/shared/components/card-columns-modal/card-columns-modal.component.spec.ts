import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardColumnsComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

describe('CardColumnsComponent', () => {
  let component: CardColumnsComponent;
  let fixture: ComponentFixture<CardColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardColumnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
