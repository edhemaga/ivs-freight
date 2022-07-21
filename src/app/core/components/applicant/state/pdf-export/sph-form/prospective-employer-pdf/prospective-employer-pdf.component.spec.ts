import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectiveEmployerPdfComponent } from './prospective-employer-pdf.component';

describe('ProspectiveEmployerPdfComponent', () => {
  let component: ProspectiveEmployerPdfComponent;
  let fixture: ComponentFixture<ProspectiveEmployerPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectiveEmployerPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectiveEmployerPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
