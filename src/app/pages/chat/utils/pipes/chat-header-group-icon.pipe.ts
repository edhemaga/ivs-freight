import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatGroupEnum } from '@pages/chat/enums';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Pipe({
    name: 'chatGroupCheckForIcon',
})
export class ChatHeaderGroupIconPipe implements PipeTransform {
    transform(group: ChatGroupEnum): string {
        switch (group) {
            case ChatGroupEnum.Department:
                return ChatSvgRoutes.hashIcon;
            case ChatGroupEnum.Truck:
                return ChatSvgRoutes.truckIcon;
            case ChatGroupEnum.Dispatch:
                return ChatSvgRoutes.dispatchBoardIcon;
            default:
                return '';
        }
    }
}
