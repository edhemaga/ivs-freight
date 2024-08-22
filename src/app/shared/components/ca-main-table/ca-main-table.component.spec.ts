import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaMainTableComponent } from './ca-main-table.component';

describe('CaMainTableComponent', () => {
  let component: CaMainTableComponent;
  let fixture: ComponentFixture<CaMainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaMainTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaMainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
