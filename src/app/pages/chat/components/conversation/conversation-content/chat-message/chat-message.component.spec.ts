import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageComponent } from '@pages/chat/components/conversation/conversation-content/chat-message/chat-message.component';

describe('ChatMessageComponent', () => {
    let component: ChatMessageComponent;
    let fixture: ComponentFixture<ChatMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatMessageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
