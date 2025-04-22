import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateUserComponent } from '@pages/new-user/modals/deactivate-user/deactivate-user.component';

describe('DeactivateUserComponent', () => {
    let component: DeactivateUserComponent;
    let fixture: ComponentFixture<DeactivateUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeactivateUserComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeactivateUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
