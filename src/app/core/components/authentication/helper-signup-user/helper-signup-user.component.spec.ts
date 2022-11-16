import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperSignupUserComponent } from './helper-signup-user.component';

describe('HelperSignupUserComponent', () => {
    let component: HelperSignupUserComponent;
    let fixture: ComponentFixture<HelperSignupUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HelperSignupUserComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HelperSignupUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
