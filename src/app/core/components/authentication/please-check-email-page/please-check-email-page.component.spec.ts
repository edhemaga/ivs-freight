import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleaseCheckEmailPageComponent } from './please-check-email-page.component';

describe('PleaseCheckEmailPageComponent', () => {
    let component: PleaseCheckEmailPageComponent;
    let fixture: ComponentFixture<PleaseCheckEmailPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PleaseCheckEmailPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PleaseCheckEmailPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
