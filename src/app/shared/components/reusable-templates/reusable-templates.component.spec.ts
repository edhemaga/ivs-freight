import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableTemplatesComponent } from './reusable-templates.component';

describe('ReusableTemplatesComponent', () => {
  let component: ReusableTemplatesComponent;
  let fixture: ComponentFixture<ReusableTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReusableTemplatesComponent]
    });
    fixture = TestBed.createComponent(ReusableTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
