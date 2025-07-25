import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCardComponent } from '@pages/new-account/pages/account-card/account-card.component';

describe('AccountCardComponent', () => {
    let component: AccountCardComponent;
    let fixture: ComponentFixture<AccountCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
