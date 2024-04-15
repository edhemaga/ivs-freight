import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaStatusSwitchComponent } from '@shared/components/ta-status-switch/ta-status-switch.component';

describe('TaStatusSwitchComponent', () => {
    let component: TaStatusSwitchComponent;
    let fixture: ComponentFixture<TaStatusSwitchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaStatusSwitchComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaStatusSwitchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
