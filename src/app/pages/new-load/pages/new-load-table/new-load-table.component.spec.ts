import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadTableComponent } from './new-load-table.component';

describe('NewLoadTableComponent', () => {
  let component: NewLoadTableComponent;
  let fixture: ComponentFixture<NewLoadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
