import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {VehicleService} from '../../../../../services/vehicle.service';


@Component({
    selector     : 'navbar-vertical-style-1',
    templateUrl  : './style-1.component.html',
    styleUrls    : ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;

    vehicleCount = 0;
    todoCount = 0;
    messageCount = 0;
    estimateRequestCount = 0;

    nav =  [

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


    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     * @param vehicleService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        public vehicleService: VehicleService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective, {static: true})
    set directive(theDirective: FusePerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._fusePerfectScrollbar.update();
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                    setTimeout(() => {
                        this._fusePerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
                    });
                }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {


        this._fuseSidebarService.getSidebar('navbar').foldBar();

        // this._fuseSidebarService.getSidebar('navbar').toggleFold();


        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                    if ( this._fuseSidebarService.getSidebar('navbar') )
                    {
                        this._fuseSidebarService.getSidebar('navbar').close();
                    }
                }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }

    /**
     * On destroy
     */

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit(): void{
        console.log(this._router.url);
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void
    {

        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }

    getChildData(data): void{
        if (data !== 'apps/dashboard'){
            this._fuseSidebarService.getSidebar('navbar').foldBar();
        }
        else if (data === 'apps/dashboard'){
            console.log('jj')
            this._fuseSidebarService.getSidebar('navbar').unFoldBar();

        }
        // console.log(data);


    }
}
