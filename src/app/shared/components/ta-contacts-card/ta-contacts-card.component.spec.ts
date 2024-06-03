import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';

describe('TaContactsCardComponent', () => {
    let component: TaContactsCardComponent;
    let fixture: ComponentFixture<TaContactsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaContactsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaContactsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
