import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';


import { MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatCheckboxModule, MatTabsModule, MatExpansionModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';


const routes = [
  
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,

    //mat 
    SatDatepickerModule, SatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule, MatProgressSpinnerModule,
    MatInputModule,
    MatMenuModule,
    // MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    DragDropModule
    
  ],
  exports: [
 
  ]
})
export class SortingDialogModule { }
