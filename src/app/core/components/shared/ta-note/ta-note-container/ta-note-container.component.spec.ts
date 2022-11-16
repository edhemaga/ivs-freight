import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaNoteContainerComponent } from './ta-note-container.component';

describe('TaNoteContainerComponent', () => {
  let component: TaNoteContainerComponent;
  let fixture: ComponentFixture<TaNoteContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaNoteContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaNoteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
