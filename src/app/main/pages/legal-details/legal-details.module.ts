import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, MatCheckboxModule, MatTabsModule, MatExpansionModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';

import { LegalDetailsComponent } from './legal-details.component';
import { ChronologyComponent } from './chronology/chronology.component';
import { AuthoritiesComponent } from './authorities/authorities.component';
import { FileNotesComponent } from './file-notes/file-notes.component';
import { SafecustodyComponent } from './safecustody/safecustody.component';
import {MatSortModule} from '@angular/material/sort';
import { SearchComponent } from './search/search.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ChronItemDailogComponent } from './chronology/chron-item-dailog/chron-item-dailog.component'
import { SafeCustodyDialogeComponent } from './safecustody/safe-custody-dialog/safe-custody-dialog.component';
import { legalDetailTaskComponent } from './legal-task/legal-task.component';
import {MatTreeModule} from '@angular/material/tree';

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
  declarations: [LegalDetailsComponent, legalDetailTaskComponent,ChronologyComponent, AuthoritiesComponent, FileNotesComponent, SafecustodyComponent,
    SearchComponent, ChronItemDailogComponent,SafeCustodyDialogeComponent],
    entryComponents: [ChronItemDailogComponent,SafeCustodyDialogeComponent],
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
    DragDropModule
  ],
  exports: [
    LegalDetailsComponent,
    ChronItemDailogComponent
  ],
 
})
export class LegalDetailsModule { }
