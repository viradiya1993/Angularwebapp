import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatListModule, MatToolbarModule, MatTabsModule, MatBadgeModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        RouterModule,
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
