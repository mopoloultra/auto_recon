import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/navigation';

@Component({
    selector     : 'vertical-layout-1',
    templateUrl  : './layout-1.component.html',
    styleUrls    : ['./layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayout1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    vehicleCountvehicleCount = 0;
    todoCount = 0;
    messageCount = 0;
    estimateRequestCount = 0;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService
    )
    {
        // Set the defaults
        this.navigation =  [

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
                            title: this.vehicleCountvehicleCount,
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
                            title: this.messageCount,
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
                            title: this.todoCount,
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
                            title: this.estimateRequestCount,
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
