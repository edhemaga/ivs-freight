import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTabSwitchComponent } from './ta-tab-switch.component';

describe('TaTabSwitchComponent', () => {
    let component: TaTabSwitchComponent;
    let fixture: ComponentFixture<TaTabSwitchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTabSwitchComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTabSwitchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
