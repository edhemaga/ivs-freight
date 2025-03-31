import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTableToolbarComponent } from './new-table-toolbar.component';

describe('NewTableToolbarComponent', () => {
  let component: NewTableToolbarComponent;
  let fixture: ComponentFixture<NewTableToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTableToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTableToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
