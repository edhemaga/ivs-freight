import { ChatMessageArrivalTypeEnum } from '@pages/chat/enums';

export class ChatDateOptionConstant {
    static options: string[] = [
        ChatMessageArrivalTypeEnum.TODAY,
        ChatMessageArrivalTypeEnum.YESTERDAY,
        ChatMessageArrivalTypeEnum.LAST_WEEK,
        ChatMessageArrivalTypeEnum.LAST_MONTH,
        ChatMessageArrivalTypeEnum.BEGINNING,
        ChatMessageArrivalTypeEnum.SPECIFIC_DATE,
    ];
}
