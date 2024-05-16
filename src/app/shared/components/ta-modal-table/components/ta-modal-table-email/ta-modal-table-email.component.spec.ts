import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableEmailComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-email/ta-modal-table-email.component';

describe('TaModalTableEmailComponent', () => {
    let component: TaModalTableEmailComponent;
    let fixture: ComponentFixture<TaModalTableEmailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTableEmailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTableEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
