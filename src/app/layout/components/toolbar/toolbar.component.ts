import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthenticationService } from '../../../_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    isTabShow: number = 1;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any;
    selectedLanguage: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
    ) {

        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.router.events.subscribe((res) => {
            this.navBarSetting(this.router.url);
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
    logOutUser() {
        this.authenticationService.logout();
    }
    navBarSetting(value) {
        let x = value.split("/");
        if (x[1] == "matters" || x[1] == "")
            this.isTabShow = 1;
        else if (x[1] == "contact")
            this.isTabShow = 2;
        else if (x[1] == "time-billing")
            this.isTabShow = 3;
        else if (x[1] == "legal-details")
            this.isTabShow = 4;
        else
            this.isTabShow = 0;
    }

}
