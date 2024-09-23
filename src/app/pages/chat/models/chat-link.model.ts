export interface ChatLink {
    messageId?: number;
    time: string;
    url: string;
    metadata: {
        title: string;
        imageUrl: string;
        type?: string;
    };
}
