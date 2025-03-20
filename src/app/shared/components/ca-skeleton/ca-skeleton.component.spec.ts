import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSkeletonComponent } from './ca-skeleton.component';

describe('CaSkeletonComponent', () => {
  let component: CaSkeletonComponent;
  let fixture: ComponentFixture<CaSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
