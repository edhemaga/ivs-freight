import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDeleteModalComponent } from './load-delete-modal.component';

describe('LoadDeleteModalComponent', () => {
  let component: LoadDeleteModalComponent;
  let fixture: ComponentFixture<LoadDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
