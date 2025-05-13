import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';

describe('MilesCardComponent', () => {
    let component: MilesCardComponent;
    let fixture: ComponentFixture<MilesCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MilesCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MilesCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
