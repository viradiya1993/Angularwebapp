import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'matters',
                title: 'Matters',
                translate: 'NAV.MATTERS.TITLE',
                type: 'item',
                icon: 'icon_matter_d.ico',
                url: 'matters',
            },
            {
                id: 'contact',
                title: 'Contact',
                translate: 'NAV.CONTACT.TITLE',
                type: 'item',
                icon: 'icon_contact_d.ico',
                url: 'contact'
            }
        ]
    }
];
