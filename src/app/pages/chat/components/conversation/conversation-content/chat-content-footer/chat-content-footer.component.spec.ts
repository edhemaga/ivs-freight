import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContentFooterComponent } from '@pages/chat/components/conversation/conversation-content/chat-content-footer/chat-content-footer.component';

describe('ChatContentFooterComponent', () => {
    let component: ChatContentFooterComponent;
    let fixture: ComponentFixture<ChatContentFooterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChatContentFooterComponent],
        });
        fixture = TestBed.createComponent(ChatContentFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
