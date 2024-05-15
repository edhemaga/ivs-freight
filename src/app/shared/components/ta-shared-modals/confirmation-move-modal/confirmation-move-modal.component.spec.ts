import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';

describe('ConfirmationMoveModalComponent', () => {
    let component: ConfirmationMoveModalComponent;
    let fixture: ComponentFixture<ConfirmationMoveModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmationMoveModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationMoveModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
