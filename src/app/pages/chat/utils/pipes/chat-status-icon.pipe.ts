import { Pipe, PipeTransform } from '@angular/core';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Pipe({
    name: 'chatStatusIcon',
})
export class ChatStatusIconPipe implements PipeTransform {
    transform(status: string): string {
        switch (status.toLowerCase()) {
            case 'active':
                return ChatSvgRoutes.activeIcon;
            case 'online':
                return ChatSvgRoutes.onlineIcon;
            case 'busy':
                return ChatSvgRoutes.busyIcon;
            case 'offline':
                return ChatSvgRoutes.offlineIcon;
            default:
                return ChatSvgRoutes.offlineIcon;
        }
    }
}
