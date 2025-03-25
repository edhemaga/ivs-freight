import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCardViewComponent } from './table-card-view.component';

describe('TableCardViewComponent', () => {
  let component: TableCardViewComponent;
  let fixture: ComponentFixture<TableCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
