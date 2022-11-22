import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairCardComponent } from './repair-card.component';

describe('RepairCardComponent', () => {
    let component: RepairCardComponent;
    let fixture: ComponentFixture<RepairCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepairCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepairCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
