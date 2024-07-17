import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableLoadItemsComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-load-items/ta-modal-table-load-items.component';

describe('TaModalTableLoadItemsComponent', () => {
  let component: TaModalTableLoadItemsComponent;
  let fixture: ComponentFixture<TaModalTableLoadItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaModalTableLoadItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaModalTableLoadItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
