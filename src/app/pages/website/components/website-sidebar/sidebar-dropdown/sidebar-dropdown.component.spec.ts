import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDropdownComponent } from '@pages/website/components/website-sidebar/sidebar-dropdown/sidebar-dropdown.component';

describe('SidebarDropdownComponent', () => {
    let component: SidebarDropdownComponent;
    let fixture: ComponentFixture<SidebarDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarDropdownComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
