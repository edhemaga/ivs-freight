import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableEmptyComponent } from './ta-table-empty.component';

describe('TaTableEmptyComponent', () => {
  let component: TaTableEmptyComponent;
  let fixture: ComponentFixture<TaTableEmptyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaTableEmptyComponent]
    });
    fixture = TestBed.createComponent(TaTableEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
