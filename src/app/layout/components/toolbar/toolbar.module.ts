import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSearchBarModule, FuseShortcutsModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ScrollingModule} from '@angular/cdk/scrolling';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';


@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        ScrollingModule,
        RouterModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatTabsModule,
        MatListModule,
        MatCardModule,
        MatBadgeModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseSidebarModule,
        FuseShortcutsModule,
        QuickPanelModule,
        MatProgressSpinnerModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
