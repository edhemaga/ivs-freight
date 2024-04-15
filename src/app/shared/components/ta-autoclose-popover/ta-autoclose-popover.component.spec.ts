import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaAutoclosePopoverComponent } from '@shared/components/ta-autoclose-popover/ta-autoclose-popover.component';

describe('TaAutoclosePopoverComponent', () => {
    let component: TaAutoclosePopoverComponent;
    let fixture: ComponentFixture<TaAutoclosePopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaAutoclosePopoverComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaAutoclosePopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
