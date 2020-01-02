import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { MatTreeModule } from '@angular/material/tree';
import { AuthGuard } from 'app/_guards';
// import { DashboardComponent } from './dashboard.component';
// import { ChartsModule } from 'ng2-charts/ng2-charts';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import {MatDividerModule} from '@angular/material/divider';

import { MainDashboardComponent } from './main-dashboard.component';

import { SnapShotComponent } from './snap-shot/snap-shot.component';
import { PeriodSummaryComponent } from './period-summary/period-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes = [
    { path: '', redirectTo: '/dashboard/monthly-graph', pathMatch: 'full', canActivate: [AuthGuard] },
    {
      path: '', component: MainDashboardComponent, children: [
        { path: 'monthly-graph', component: DashboardComponent,
     },
     { path: 'sanp-shot', component: SnapShotComponent },
     { path: 'period-summary', component: PeriodSummaryComponent },
      
      ], canActivate: [AuthGuard]
    }
  ];
  
@NgModule({
  declarations: [DashboardComponent,MainDashboardComponent,SnapShotComponent,PeriodSummaryComponent],
  entryComponents: [],
  imports: [
    ChartsModule,
    NgxChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
  }),
    FuseWidgetModule,
    CommonModule,
    MatDividerModule,
    MatTreeModule,
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
    MatSortModule,
    // ApplicationPipesModule
  ],
  exports: [
    // TaskComponent
  ],

  providers: [
    // AnalyticsDashboardDb,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class MainDashboardModule { }
