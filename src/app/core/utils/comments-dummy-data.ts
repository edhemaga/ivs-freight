export interface DummyComment {
    userAvatar: string;
    fullName: string;
    avatarColor: {
        background: string;
        color: string;
    };
    textShortName: string;
    date: string;
    me: boolean;
    edited: boolean;
    comment: string;
    isOpen?: boolean;
}

export class DUMMY_COMMENT_DATA {
    static COUNT: number = 4;

    static DISPLAY_COMMENTS: DummyComment[] = [
        {
            userAvatar: null,
            fullName: 'Denis Rodman',
            avatarColor: {
                background: '#D2EDE8',
                color: '#4DB6A2',
            },
            textShortName: 'DR',
            date: '04/25/24, 05:18 AM',
            me: false,
            edited: false,
            comment:
                'At vero eos et accusam et just dolore sind et accusam et just dolore et accusam et just dolore...',
        },
        {
            userAvatar: null,
            fullName: 'Vladimir Milosavljevic',
            avatarColor: {
                background: '#D2EDE8',
                color: '#4DB6A2',
            },
            textShortName: 'AM',
            date: '04/25/24, 05:18 AM',
            me: true,
            edited: false,
            comment:
                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
        },
        {
            userAvatar: null,
            fullName: 'Betty Black',
            avatarColor: {
                background: '#F9DCDC',
                color: '#E57373',
            },
            textShortName: 'BB',
            date: 'Yesterday, 05:18 AM',
            me: false,
            edited: true,
            comment: 'At vero eos et accusam et just dolore sind...',
        },
        {
            userAvatar: null,
            fullName: 'Alex Middleman',
            avatarColor: {
                background: '#F8EBC2',
                color: '#E3B00F',
            },
            textShortName: 'AM',
            date: '04/25/24, 05:18 AM',
            me: false,
            edited: true,
            comment: 'At vero eos et accusam et just dolore sind...',
        },
        {
            userAvatar: null,
            fullName: 'James Smith',
            avatarColor: {
                background: '#F8EBC2',
                color: '#E3B00F',
            },
            textShortName: 'DR',
            date: '04/25/24, 05:18 AM',
            me: false,
            edited: false,
            comment: 'At vero eos et accusam et just dolore sind...',
        },
    ];
}
