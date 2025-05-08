// Models
import {
    CompanyUserListItemResponse,
    CompanyUserListResponse,
    CompanyUserResponse,
} from 'appcoretruckassist';

import { eStatusTab } from '@shared/enums';

import { ITableData } from '@shared/models';

// Interface
import { IMappedUser } from '@pages/new-user/interfaces';

export class UsersHelper {
    static increaseActiveTabCount(toolbarTabs: ITableData[]): ITableData[] {
        const updatedTabs = [...toolbarTabs];
        updatedTabs[0] = {
            ...toolbarTabs[0],
            length: toolbarTabs[0].length + 1,
        };
        return updatedTabs;
    }

    static updateTabsCount(
        payload: CompanyUserListResponse,
        toolbarTabs: ITableData[]
    ): ITableData[] {
        return [
            { ...toolbarTabs[0], length: payload.activeCount },
            {
                ...toolbarTabs[1],
                length: payload.inactiveCount,
            },
        ];
    }

    static updateTabsCountAfterDelete(
        currentTab: eStatusTab,
        deletedLength: number,
        toolbarTabs: ITableData[],
        isIncreaseInOtherTab: boolean
    ): ITableData[] {
        const [activeIndex, inactiveIndex] = [0, 1];
        const updatedTabs = [...toolbarTabs];

        // Get the indexes based on currentTab
        const [tabToUpdate, otherTab] =
            currentTab === eStatusTab.ACTIVE
                ? [activeIndex, inactiveIndex]
                : [inactiveIndex, activeIndex];

        // Update the length for the current tab
        updatedTabs[tabToUpdate] = {
            ...toolbarTabs[tabToUpdate],
            length: Math.max(
                0,
                toolbarTabs[tabToUpdate].length - deletedLength
            ),
        };

        // If we should increase the length for the other tab
        if (isIncreaseInOtherTab) {
            updatedTabs[otherTab] = {
                ...toolbarTabs[otherTab],
                length: toolbarTabs[otherTab].length + deletedLength,
            };
        }

        return updatedTabs;
    }

    static usersMapper(
        users: CompanyUserListItemResponse[] | CompanyUserResponse[]
    ): IMappedUser[] {
        return users.map((user) => {
            const {
                firstName,
                lastName,
                avatarFile,
                id,
                department,
                email,
                companyOffice,
                extensionPhone,
                phone,
                personalPhone,
                personalEmail,
                address,
                userStatus,
                lastLogin,
                bank,
                routingNumber,
                accountNumber,
                paymentType,
                salary,
                is1099,
                commission,
                startDate,
                createdAt,
                updatedAt,
                deactivatedAt,
            } = user;

            const mapped: IMappedUser = {
                id,
                isSelected: false,
                fullName: `${firstName} ${lastName}`,
                avatar: avatarFile?.url,
                // For edit we get department as object inside list it is string
                // TODO: Should we ask back to be same response maybe there is more changes?
                department:
                    typeof department === 'object'
                        ? department.name
                        : department,
                companyOffice,
                email,
                phone,
                extensionPhone,
                personalPhone,
                personalEmail,
                address,
                userStatus,
                lastLogin,
                bankName: bank?.name,
                routingNumber,
                accountNumber,
                payrollType: paymentType?.name,
                salary,
                is1099,
                commission,
                startDate,
                createdAt,
                updatedAt,
                deactivatedAt,
            };

            return mapped;
        });
    }
}
