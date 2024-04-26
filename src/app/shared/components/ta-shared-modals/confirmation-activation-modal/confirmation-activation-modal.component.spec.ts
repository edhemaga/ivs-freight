import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

describe('ConfirmationActivationModalComponent', () => {
    let component: ConfirmationActivationModalComponent;
    let fixture: ComponentFixture<ConfirmationActivationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmationActivationModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationActivationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
