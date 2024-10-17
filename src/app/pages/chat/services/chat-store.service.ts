import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
    closeAllProfileInformation,
    displayProfileDetails,
    setConversation,
    setProfileDetails,
    setUnreadCount,
    displayConversationParticipants,
    resetReplyAndEditMessage,
    replyMessage,
    editMessage,
    deleteMessage,
    addMessage,
    setUserTyping,
    getSelectedConversation,
    getIsProfileDetailsDisplayed,
    getConversationProfileDetails,
    getIsConversationParticipantsDisplayed,
    selectMessageResponse,
    selectEditMessage,
    selectReplyMessage,
    activeReplyOrEdit,
    setMessageResponse,
    selectAttachments,
    deleteAttachment,
    deleteAllAttachments,
    setAttachment,
    openAttachmentUpload,
    closeAttachmentUpload,
    selectAttachmentUploadStatus,
} from '@pages/chat/store';

// Models
import {
    ChatConversationDetails,
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
} from '@pages/chat/models';
import { ConversationInfoResponse } from 'appcoretruckassist';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

@Injectable({
    providedIn: 'root',
})
export class ChatStoreService {
    private conversation$: Observable<ChatSelectedConversation>;
    private messages$!: Observable<ChatMessageResponse>;
    private isProfileDetailsDisplayed$: Observable<boolean>;
    private isParticipantsDisplayed$: Observable<boolean>;
    private conversationProfileDetails$: Observable<ChatConversationDetails>;
    private editMessage$: Observable<ChatMessage>;
    private replyMessage$: Observable<ChatMessage>;
    private activeReplyOrEdit$: Observable<number>;
    private attachments$: Observable<UploadFile[]>;
    private isAttachmentUploadActive$: Observable<boolean>;

    constructor(private store: Store) {}

    // Actions
    public setUnreadCount(count: number): void {
        this.store.dispatch(
            setUnreadCount({
                count,
            })
        );
    }

    public closeAllProfileInformation(): void {
        this.store.dispatch(closeAllProfileInformation());
    }

    public setConversation(
        selectedConversation: ChatSelectedConversation
    ): void {
        this.store.dispatch(setConversation(selectedConversation));
    }

    public setMessageResponse(data: ChatMessageResponse): void {
        this.store.dispatch(setMessageResponse(data));
    }

    public displayProfileDetails(): void {
        this.store.dispatch(displayProfileDetails());
    }

    public displayConversationParticipants(): void {
        this.store.dispatch(displayConversationParticipants());
    }

    public setProfileDetails(data: ChatConversationDetails): void {
        this.store.dispatch(setProfileDetails(data));
    }

    public resetReplyAndEditMessage(): void {
        this.store.dispatch(resetReplyAndEditMessage());
    }

    public replyMessage(message: ChatMessage): void {
        this.store.dispatch(replyMessage(message));
    }

    public editMessage(message: ChatMessage): void {
        this.store.dispatch(editMessage(message));
    }

    public deleteMessage(message: ChatMessage): void {
        this.store.dispatch(deleteMessage(message));
    }

    public addMessage(message: ChatMessage): void {
        this.store.dispatch(addMessage(message));
    }

    public setUserTyping(name: string): void {
        this.store.dispatch(setUserTyping({ name }));
    }

    public openAttachmentUpload(): void {
        this.store.dispatch(openAttachmentUpload());
    }

    public closeAttachmentUpload(): void {
        this.store.dispatch(closeAttachmentUpload());
    }

    public setAttachment(attachment: UploadFile): void {
        this.store.dispatch(setAttachment(attachment));
    }

    public deleteAttachment(attachment: UploadFile): void {
        this.store.dispatch(deleteAttachment(attachment));
    }

    public deleteAllAttachments(): void {
        this.store.dispatch(deleteAllAttachments());
    }

    // Selectors
    public selectMessages(): Observable<ChatMessageResponse> {
        if (!this.messages$)
            this.messages$ = this.store.select(selectMessageResponse);
        return this.messages$;
    }

    public selectConversation(): Observable<ChatSelectedConversation> {
        if (!this.conversation$)
            this.conversation$ = this.store.select(getSelectedConversation);
        return this.conversation$;
    }
    public selectIsProfileDetailsDisplayed(): Observable<boolean> {
        if (!this.isProfileDetailsDisplayed$)
            this.isProfileDetailsDisplayed$ = this.store.select(
                getIsProfileDetailsDisplayed
            );
        return this.isProfileDetailsDisplayed$;
    }

    public selectIsConversationParticipantsDisplayed(): Observable<boolean> {
        if (!this.isParticipantsDisplayed$)
            this.isParticipantsDisplayed$ = this.store.select(
                getIsConversationParticipantsDisplayed
            );
        return this.isParticipantsDisplayed$;
    }

    public selectConversationProfileDetails(): Observable<ChatConversationDetails> {
        if (!this.conversationProfileDetails$)
            this.conversationProfileDetails$ = this.store.select(
                getConversationProfileDetails
            );
        return this.conversationProfileDetails$;
    }

    public selectEditMessage(): Observable<ChatMessage> {
        if (!this.editMessage$)
            this.editMessage$ = this.store.select(selectEditMessage);
        return this.editMessage$;
    }

    public selectReplyMessage(): Observable<ChatMessage> {
        if (!this.replyMessage$)
            this.replyMessage$ = this.store.select(selectReplyMessage);
        return this.replyMessage$;
    }

    public selectActiveReplyOrEdit(): Observable<number> {
        if (!this.activeReplyOrEdit$)
            this.activeReplyOrEdit$ = this.store.select(activeReplyOrEdit);
        return this.activeReplyOrEdit$;
    }

    public selectAttachmentUploadStatus(): Observable<boolean> {
        if (!this.isAttachmentUploadActive$)
            this.isAttachmentUploadActive$ = this.store.select(
                selectAttachmentUploadStatus
            );
        return this.isAttachmentUploadActive$;
    }

    public selectAttachments(): Observable<UploadFile[]> {
        if (!this.attachments$)
            this.attachments$ = this.store.select(selectAttachments);
        return this.attachments$;
    }
}
