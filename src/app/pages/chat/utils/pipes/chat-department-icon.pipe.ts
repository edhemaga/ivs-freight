import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatDepartmentTypeEnum } from '@pages/chat/enums';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Pipe({
    name: 'chatDepartmentIcon',
})
export class ChatDepartmentIconPipe implements PipeTransform {
    transform(departmentName: string): string {
        if (!departmentName) {
            return '';
        }

        const normalizedDepartmentName = departmentName.trim().toLowerCase();

        switch (normalizedDepartmentName) {
            case ChatDepartmentTypeEnum.General:
                return ChatSvgRoutes.companyIcon;
            case ChatDepartmentTypeEnum.Truck:
                return ChatSvgRoutes.truckIcon;
            case ChatDepartmentTypeEnum.Safety:
                return ChatSvgRoutes.safetyIcon;
            case ChatDepartmentTypeEnum.Repair:
                return ChatSvgRoutes.repairIcon;
            case ChatDepartmentTypeEnum.Recruiting:
                return ChatSvgRoutes.recruitingIcon;
            case ChatDepartmentTypeEnum.Accounting:
                return ChatSvgRoutes.accountingIcon;
            default:
                return '';
        }
    }
}
