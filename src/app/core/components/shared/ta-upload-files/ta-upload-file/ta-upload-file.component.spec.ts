/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaUploadFileComponent } from './ta-upload-file.component';

describe('TaUploadFileComponent', () => {
    let component: TaUploadFileComponent;
    let fixture: ComponentFixture<TaUploadFileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaUploadFileComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaUploadFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
