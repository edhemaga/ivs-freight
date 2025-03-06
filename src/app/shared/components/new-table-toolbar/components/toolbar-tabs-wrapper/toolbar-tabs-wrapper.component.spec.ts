import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';

describe('ToolbarTabsWrapperComponent', () => {
  let component: ToolbarTabsWrapperComponent;
  let fixture: ComponentFixture<ToolbarTabsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarTabsWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarTabsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
