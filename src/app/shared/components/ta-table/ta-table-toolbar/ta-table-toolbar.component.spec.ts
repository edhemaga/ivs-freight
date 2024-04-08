import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableToolbarComponent } from './ta-table-toolbar.component';

describe('TaTableToolbarComponent', () => {
    let component: TaTableToolbarComponent;
    let fixture: ComponentFixture<TaTableToolbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTableToolbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTableToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
