// enums
import { eSharedString, eStatusTab } from '@shared/enums';

// interfaces
import { IMappedUser } from '@pages/new-user/interfaces';
import { ITableData } from '@shared/models';

// models
import {
    CompanyUserListItemResponse,
    CompanyUserListResponse,
} from 'appcoretruckassist';

export class UsersHelper {
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

    static usersMapper(users: CompanyUserListItemResponse[]): IMappedUser[] {
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
                department,
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

    static resendInvitationUsersMapper(
        users: IMappedUser[],
        resendInvitationUserId: number
    ): IMappedUser[] {
        return users.map((user) => {
            const { id, userStatus } = user;
            const isInvitationSent = id === resendInvitationUserId;

            const mapped: IMappedUser = {
                ...user,
                userStatus: isInvitationSent
                    ? eSharedString.INVITED
                    : userStatus,
            };

            return mapped;
        });
    }
}
