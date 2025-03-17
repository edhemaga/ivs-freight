import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesTableComponent } from './miles-table.component';

describe('MilesTableComponent', () => {
  let component: MilesTableComponent;
  let fixture: ComponentFixture<MilesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
