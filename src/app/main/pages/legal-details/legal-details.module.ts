import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
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

import { LegalDetailsComponent } from './legal-details.component';
import { ChronologyComponent } from './chronology/chronology.component';
import { AuthoritiesComponent } from './authorities/authorities.component';
import { FileNotesComponent } from './file-notes/file-notes.component';
import { SafecustodyComponent } from './safecustody/safecustody.component';
import { MatSortModule } from '@angular/material/sort';
import { SearchComponent } from './search/search.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ChronItemDailogComponent } from './chronology/chron-item-dailog/chron-item-dailog.component'
import { SafeCustodyDialogeComponent } from './safecustody/safe-custody-dialog/safe-custody-dialog.component';
import { legalDetailTaskComponent } from './legal-task/legal-task.component';
import { MatTreeModule } from '@angular/material/tree';
import { ApplicationPipesModule } from '../application-pipes.module';

const routes = [
  { path: '', redirectTo: '/legal-details/chronology', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: '', component: LegalDetailsComponent, children: [
      { path: 'chronology', component: ChronologyComponent },
      { path: 'authority', component: AuthoritiesComponent },
      { path: 'file-notes', component: FileNotesComponent },
      { path: 'legal-detail-task', component: legalDetailTaskComponent },
      { path: 'safe-custody', component: SafecustodyComponent },
      { path: 'search', component: SearchComponent },

    ], canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [LegalDetailsComponent, legalDetailTaskComponent, ChronologyComponent, AuthoritiesComponent, FileNotesComponent, SafecustodyComponent,
    SearchComponent, ChronItemDailogComponent, SafeCustodyDialogeComponent],
  entryComponents: [ChronItemDailogComponent, SafeCustodyDialogeComponent],
  imports: [
    CommonModule,
    SatDatepickerModule, SatNativeDateModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatTreeModule,
    //mat 
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    // MatRippleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    ApplicationPipesModule

  ],
  exports: [
    LegalDetailsComponent,
    // ChronItemDailogComponent
  ],

})
export class LegalDetailsModule { }
