import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';

describe('TaProgressExpirationComponent', () => {
    let component: TaProgressExpirationComponent;
    let fixture: ComponentFixture<TaProgressExpirationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaProgressExpirationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaProgressExpirationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
