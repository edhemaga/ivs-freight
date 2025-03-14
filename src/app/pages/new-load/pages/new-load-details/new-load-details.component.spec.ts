import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadDetailsComponent } from '@pages/new-load/pages/new-load-details/new-load-details.component';

describe('NewLoadDetailsComponent', () => {
  let component: NewLoadDetailsComponent;
  let fixture: ComponentFixture<NewLoadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLoadDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLoadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
