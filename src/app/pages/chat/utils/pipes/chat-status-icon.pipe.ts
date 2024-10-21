import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatActivityStatusEnum } from '@pages/chat/enums';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Pipe({
    name: 'chatStatusIcon',
})
export class ChatStatusIconPipe implements PipeTransform {
    transform(status: ChatActivityStatusEnum): string {
        switch (status) {
            case ChatActivityStatusEnum.ACTIVE:
                return ChatSvgRoutes.activeIcon;
            case ChatActivityStatusEnum.ONLINE:
                return ChatSvgRoutes.onlineIcon;
            case ChatActivityStatusEnum.BUSY:
                return ChatSvgRoutes.busyIcon;
            case ChatActivityStatusEnum.OFFLINE:
                return ChatSvgRoutes.offlineIcon;
            default:
                return ChatSvgRoutes.offlineIcon;
        }
    }
}
