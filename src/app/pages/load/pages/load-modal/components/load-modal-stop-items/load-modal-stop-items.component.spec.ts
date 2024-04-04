import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModalStopItemsComponent } from './load-modal-stop-items.component';

describe('LoadModalStopItemsComponent', () => {
    let component: LoadModalStopItemsComponent;
    let fixture: ComponentFixture<LoadModalStopItemsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadModalStopItemsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadModalStopItemsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
