import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'sample',
                title: 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                icon: 'email',
                url: '/sample',
            },
            {
                id: 'calendar',
                title: 'Calendar',
                translate: 'NAV.CALENDAR.TITLE',
                type: 'item',
                icon: 'today',
                url: '/login'
            },
            {
                id: 'calendar',
                title: 'Calendar',
                translate: 'NAV.CALENDAR.TITLE',
                type: 'item',
                icon: 'today',
                url: '/forgot-password'
            },
        ]
    }
];
