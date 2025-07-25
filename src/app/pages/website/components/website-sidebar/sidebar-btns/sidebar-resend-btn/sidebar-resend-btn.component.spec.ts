import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarResendBtnComponent } from '@pages/website/components/website-sidebar/sidebar-btns/sidebar-resend-btn/sidebar-resend-btn.component';

describe('SidebarResendBtnComponent', () => {
    let component: SidebarResendBtnComponent;
    let fixture: ComponentFixture<SidebarResendBtnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarResendBtnComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarResendBtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
