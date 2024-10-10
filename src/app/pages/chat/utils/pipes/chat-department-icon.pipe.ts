import { Pipe, PipeTransform } from '@angular/core';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Pipe({
    name: 'chatDepartmentIcon',
})
export class ChatDepartmentIconPipe implements PipeTransform {
    transform(departmentName: string): string {
        if (!departmentName) {
            return ''; // Return an empty string if the department name is null or undefined
        }

        const normalizedDepartmentName = departmentName.trim().toLowerCase();

        switch (normalizedDepartmentName) {
            case 'general':
                return ChatSvgRoutes.companyIcon;
            case 'truck':
                return ChatSvgRoutes.truckIcon;
            case 'safety':
                return ChatSvgRoutes.safetyIcon;
            case 'repair':
                return ChatSvgRoutes.repairIcon;
            case 'recruiting':
                return ChatSvgRoutes.recruitingIcon;
            case 'accounting':
                return ChatSvgRoutes.accountingIcon;
            default:
                return ''; // Return a default icon or empty string
        }
    }
}
