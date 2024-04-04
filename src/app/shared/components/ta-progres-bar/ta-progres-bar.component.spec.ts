import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProgresBarComponent } from './ta-progres-bar.component';

describe('TaProgresBarComponent', () => {
    let component: TaProgresBarComponent;
    let fixture: ComponentFixture<TaProgresBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaProgresBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaProgresBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
