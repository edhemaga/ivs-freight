import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsDescriptionComponent } from './load-details-description.component';

describe('LoadDetailsDescriptionComponent', () => {
  let component: LoadDetailsDescriptionComponent;
  let fixture: ComponentFixture<LoadDetailsDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDetailsDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDetailsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
