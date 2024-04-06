import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaConfirmationModalResetComponent } from './ta-confirmation-reset.component';

describe('TaConfirmationModalResetComponent', () => {
    let component: TaConfirmationModalResetComponent;
    let fixture: ComponentFixture<TaConfirmationModalResetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaConfirmationModalResetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaConfirmationModalResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
