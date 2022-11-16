import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchboardTablesComponent } from './dispatchboard-tables.component';

describe('DispatchboardTablesComponent', () => {
    let component: DispatchboardTablesComponent;
    let fixture: ComponentFixture<DispatchboardTablesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchboardTablesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DispatchboardTablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
