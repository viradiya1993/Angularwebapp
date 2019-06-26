import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { ActivitiesComponent } from './activities.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';


const routes = [
    { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
];

@NgModule({
    declarations:[
        ActivitiesComponent,
        ActivityDialogComponent   
    ],
    entryComponents:[
        ActivitiesComponent,
        ActivityDialogComponent   
    ],
    imports:[
        CommonModule,
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        // MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatCardModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatDialogModule,
        MatProgressSpinnerModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        SatDatepickerModule, SatNativeDateModule,

        MaterialTimePickerModule,
        MatCheckboxModule,
        DragDropModule,
        MatExpansionModule,
        MatRadioModule,
        // N level tree checkbox
        MatTreeModule,
        BrowserAnimationsModule,
        CdkTableModule,
        CdkTreeModule,
        ScrollDispatchModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatSortModule
    ],
    exports:[
        MatTreeModule,
        CdkTableModule,
        CdkTreeModule,
        ScrollDispatchModule,
        MatDatepickerModule
    ]
})

export class ActivitiesModule { }