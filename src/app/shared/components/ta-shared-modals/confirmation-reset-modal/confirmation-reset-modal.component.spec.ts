import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';

describe('ConfirmationResetModalComponent', () => {
    let component: ConfirmationResetModalComponent;
    let fixture: ComponentFixture<ConfirmationResetModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmationResetModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationResetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
