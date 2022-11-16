import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationTableComponent } from './violation-table.component';

describe('ViolationTableComponent', () => {
    let component: ViolationTableComponent;
    let fixture: ComponentFixture<ViolationTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ViolationTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViolationTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
