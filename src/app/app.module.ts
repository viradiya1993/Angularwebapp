import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
    MatButtonModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule, MatTabsModule,
    MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
    MatTableModule, MatToolbarModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { PagesModule } from 'app/main/pages/pages.module';


//sorting colume Dialog
import { SortingDialogComponent, filterNames } from './main/sorting-dialog/sorting-dialog.component';
import { ReportsComponent } from './main/reports/reports.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotFoundComponent } from './main/errors/not-found/not-found.component';
import { InternalErrorComponent } from './main/errors/internal-error/internal-error.component';

//Datepicker
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//end
const appRoutes: Routes = [
    { path: '', loadChildren: './main/authentication/authentication.module#AuthenticationModule' },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        SortingDialogComponent,
        filterNames,
        NotFoundComponent,
        InternalErrorComponent,
        ReportsComponent

    ],
    entryComponents: [
        SortingDialogComponent,
        ReportsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        DragDropModule,
        MatPaginatorModule,
        MatDividerModule,
        MatDialogModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatMenuModule,
        // MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatTabsModule,

        //Datepicker
        SatDatepickerModule,
        SatNativeDateModule,

        // App modules
        LayoutModule,
        PagesModule,

        ToastrModule.forRoot(), // ToastrModule added
        MatProgressSpinnerModule
    ],
    exports: [
        SortingDialogComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        DatePipe,
    ],
})
export class AppModule {
}
