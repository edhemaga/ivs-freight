import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardsComponent } from '@pages/new-user/pages/user-cards/user-cards.component';

describe('UserCardsComponent', () => {
    let component: UserCardsComponent;
    let fixture: ComponentFixture<UserCardsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserCardsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserCardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
