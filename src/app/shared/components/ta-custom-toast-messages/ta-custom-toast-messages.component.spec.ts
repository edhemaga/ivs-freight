import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomToastMessagesComponent } from '@shared/components/ta-custom-toast-messages/ta-custom-toast-messages.component';

describe('TaCustomToastMessagesComponent', () => {
    let component: TaCustomToastMessagesComponent;
    let fixture: ComponentFixture<TaCustomToastMessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCustomToastMessagesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCustomToastMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
