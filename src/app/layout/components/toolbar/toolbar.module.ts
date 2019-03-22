import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatListModule, MatToolbarModule, MatTabsModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';


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

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
