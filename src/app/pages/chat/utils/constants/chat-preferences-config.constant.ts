// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Models
import { ChatPreferenceItem } from '@pages/chat/models';

// Enums
import { ChatStringTypeEnum } from '@pages/chat/enums';

export class ChatPreferencesConfig {
    static items: ChatPreferenceItem[] = [
        {
            id: 'read',
            name: 'Mark all as Read',
            isHighlighted: false,
            borderBottom: true,
            icon: ChatSvgRoutes.circleCheckmarkIcon,
            isExpandable: false,
            value: false,
            toggleValue: function () {
                this.value = !this.value;
            },
        },
        {
            id: 'status',
            name: 'Set Status',
            isHighlighted: false,
            isExpandable: true,
            value: false,
            icon: ChatSvgRoutes.headerArrowDownIcon,
            items: [
                {
                    id: 'online',
                    name: 'Online',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[1]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                    isRadioButton: true,
                },
                {
                    id: 'busy',
                    name: 'Busy',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[1]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },

                    isRadioButton: true,
                },
                {
                    id: 'away',
                    name: 'Away',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[1]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                    isRadioButton: true,
                },
            ],
            toggleValue: function () {
                this.value = !this.value;
                this.isHighlighted = this.value;
            },
        },
        {
            id: 'messages',
            name: 'Sort Message',
            isHighlighted: false,
            isExpandable: true,
            value: false,
            items: [
                {
                    id: 'favourites',
                    name: 'Favorites on top',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isRadioButton: true,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[2]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'recent',
                    name: 'Recent on top',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isRadioButton: true,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[2]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'unread',
                    name: 'Unread on top',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isRadioButton: true,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[2]
                        );
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
            ],
            icon: ChatSvgRoutes.headerArrowDownIcon,
            toggleValue: function () {
                this.value = !this.value;
                this.isHighlighted = this.value;
            },
        },
        {
            id: ChatStringTypeEnum.VIEW,
            name: 'Chat View',
            isHighlighted: false,
            isExpandable: true,
            value: false,
            items: [
                {
                    id: 'regular',
                    name: 'Regular',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isRadioButton: true,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[3]
                        );
                        this.value = !this.value;
                    },
                },
                {
                    id: 'advanced',
                    name: 'Advanced',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isRadioButton: true,
                    toggleValue: function () {
                        ChatPreferencesConfig.resetChildren(
                            ChatPreferencesConfig.items[3]
                        );
                        this.value = !this.value;
                    },
                },
            ],
            icon: ChatSvgRoutes.headerArrowDownIcon,
            toggleValue: function () {
                this.value = !this.value;
                this.isHighlighted = this.value;
            },
        },
        {
            id: 'notifications',
            name: 'Notifications',
            isHighlighted: false,
            isExpandable: true,
            value: false,
            items: [
                {
                    id: 'messages',
                    name: 'Direct Messages',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isCheckmark: true,
                    toggleValue: function () {
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'mentions',
                    name: 'Mentions',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isCheckmark: true,
                    toggleValue: function () {
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'department',
                    name: 'Department',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isCheckmark: true,
                    toggleValue: function () {
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'dispatch',
                    name: 'Dispatch Board',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isCheckmark: true,
                    toggleValue: function () {
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
                {
                    id: 'truck',
                    name: 'Truck',
                    isHighlighted: false,
                    isExpandable: false,
                    value: false,
                    isCheckmark: true,
                    toggleValue: function () {
                        this.value = !this.value;
                        this.isHighlighted = this.value;
                    },
                },
            ],
            icon: ChatSvgRoutes.headerArrowDownIcon,
            toggleValue: function () {
                this.value = !this.value;
                this.isHighlighted = this.value;
            },
        },
        {
            id: 'subscriptions',
            name: 'Subscriptions',
            isHighlighted: false,
            borderTop: true,
            icon: ChatSvgRoutes.notificationIcon,
            isExpandable: false,
            value: false,
            toggleValue: function () {
                this.value = !this.value;
            },
        },
    ];

    static resetChildren = (data: ChatPreferenceItem): void => {
        data?.items.forEach((item) => (item.value = false));
    };
}
