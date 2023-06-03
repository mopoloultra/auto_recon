import { FuseNavigation } from '@fuse/types';


export const navigation: FuseNavigation[] = [

    {
        id      : 'main',
        title   : 'Main',
        icon    : 'dashboard',
        type    : 'group',
        children: [
            {
                id   : 'dashboard',
                title: 'Dashoard',
                type : 'item',
                icon : 'dashboard',
                url  : 'apps/dashboard'

            },
            {
                id   : 'vehicles',
                title: 'Vehicles',
                type : 'item',
                icon : 'directions_car',
                url  : '/apps/vehicles',
                badge: {
                    title: '124',
                    bg   : 'red',
                    fg   : '#ffffff'
                }
            },

            {
                id   : 'messenger',
                title: 'Messenger',
                type : 'item',
                icon : 'chat',
                url  : '/apps/chat',
                badge: {
                    title: '13',
                    bg   : 'green',
                    fg   : '#ffffff'
                }
            },

            {
                id   : 'todo',
                title: 'To-Do',
                type : 'item',
                icon : 'check_box',
                url  : '/apps/todo/all',
                badge: {
                    title: '3',
                    bg   : '#ff5500',
                    fg   : '#ffffff'
                }
            },

            {
                id   : 'calender',
                title: 'Calender',
                type : 'item',
                icon : 'date_range',
                url  : '/apps/calendar'
            },

            {
                id   : 'contacts',
                title: 'Contacts',
                type : 'item',
                icon : 'perm_contact_calendar',
                url  : '/apps/contacts'
            },

            {
                id   : 'file-manager',
                title: 'File Manager',
                type : 'item',
                icon : 'folder',
                url  : '/apps/file-manager'
            },

            {
                id   : 'reports',
                title: 'Reports',
                type : 'item',
                icon : 'list_alt',
                url  : '/#'
            }
        ]
    },


    {
        id      : 'apps',
        title   : 'Apps',
        icon    : 'access_alarm',
        type    : 'group',
        children: [
            {
                id   : 'inspections',
                title: 'Inspections',
                type : 'item',
                icon : 'search',
                url  : '/#'
            },

            {
                id   : 'estimate-requests',
                title: 'Estimate Requests',
                type : 'item',
                icon : 'tune',
                url  : '/#',
                badge: {
                    title: '124',
                    bg   : 'red',
                    fg   : '#ffffff'
                }
            },

            {
                id   : 'sublet-portal',
                title: 'Sublet Portal',
                type : 'item',
                icon : 'sync',
                url  : '/#'
            },

            {
                id   : 'swift-locate',
                title: 'Swift Locate',
                type : 'item',
                icon : 'pin_drop',
                url  : '/#'
            },

            {
                id   : 'swift-monitor',
                title: 'Swift Monitor',
                type : 'item',
                icon : 'dvr',
                url  : '/#'
            }

        ]
    }
];


