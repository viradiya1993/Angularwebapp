import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatRippleModule, MatFormFieldModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { FuseNavigationComponent, filterNames } from './navigation.component';
import { FuseNavVerticalItemComponent } from './vertical/item/item.component';
import { FuseNavVerticalCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { FuseNavVerticalGroupComponent } from './vertical/group/group.component';
import { FuseNavHorizontalItemComponent } from './horizontal/item/item.component';
import { FuseNavHorizontalCollapsableComponent } from './horizontal/collapsable/collapsable.component';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatIconModule,
        MatRippleModule,

        TranslateModule.forChild(),
        FormsModule,
        MatInputModule,
        MatListModule,
        MatCheckboxModule,
        FuseSharedModule,
        MatAutocompleteModule,
        MatFormFieldModule


    ],
    exports: [
        FuseNavigationComponent,
        filterNames
    ],
    declarations: [
        FuseNavigationComponent,
        FuseNavVerticalGroupComponent,
        FuseNavVerticalItemComponent,
        FuseNavVerticalCollapsableComponent,
        FuseNavHorizontalItemComponent,
        FuseNavHorizontalCollapsableComponent,
        filterNames
    ]
})
export class FuseNavigationModule {
}
