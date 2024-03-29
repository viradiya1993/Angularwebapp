import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MattersComponent } from './matters.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
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
import { MattersListComponent } from './matters-list/matters-list.component';
import { MattersSortDetailComponent } from './matters-sort-detail/matters-sort-detail.component';
import { GeneralComponent } from './matter-popup/general/general.component';
import { ClientComponent } from './matter-popup/client/client.component';
import { RatesComponent } from './matter-popup/rates/rates.component';
// import { DetailsComponent } from './matter-popup/details/details.component';
import { OthersComponent } from './matter-popup/others/others.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatterPopupComponent } from './matter-popup/matter-popup.component';
//import { NewmatterDetailComponent } from './matter-popup/newmatter-detail/newmatter-detail.component';
import { CriminalComponent } from './matter-popup/newmatter-detail/criminal/criminal.component';
import { CommercialComponent } from './matter-popup/newmatter-detail/commercial/commercial.component';
import { CompensationComponent } from './matter-popup/newmatter-detail/compensation/compensation.component';
import { CompulsoryAcquisitionComponent } from './matter-popup/newmatter-detail/compulsory-acquisition/compulsory-acquisition.component';
import { FamilyComponent } from './matter-popup/newmatter-detail/family/family.component';
import { ImmigrationComponent } from './matter-popup/newmatter-detail/immigration/immigration.component';
import { LeasingComponent } from './matter-popup/newmatter-detail/leasing/leasing.component';
import { LitigationComponent } from './matter-popup/newmatter-detail/litigation/litigation.component';
import { MaritimeComponent } from './matter-popup/newmatter-detail/maritime/maritime.component';
import { MortgageFinanceComponent } from './matter-popup/newmatter-detail/mortgage-finance/mortgage-finance.component';
import { PropertyPurchaseComponent } from './matter-popup/newmatter-detail/property-purchase/property-purchase.component';
import { PropertyComponent } from './matter-popup/newmatter-detail/property-sale/property.component';
import { StrataComponent } from './matter-popup/newmatter-detail/strata/strata.component';
import { TrademarkIPComponent } from './matter-popup/newmatter-detail/trademark-ip/trademark-ip.component';
import { WillsEstateComponent } from './matter-popup/newmatter-detail/wills-estate/wills-estate.component';
import { MatterAddressPopupComponent } from './matter-popup/newmatter-detail/matter-address-popup/matter-address-popup.component';
import { AddressComponent } from './matter-popup/newmatter-detail/matter-address-popup/address/address.component';
import { TitleComponent } from './matter-popup/newmatter-detail/matter-address-popup/title/title.component';
import { CouncilComponent } from './matter-popup/newmatter-detail/matter-address-popup/council/council.component';
import { CrownAllotmentComponent } from './matter-popup/newmatter-detail/matter-address-popup/crown-allotment/crown-allotment.component';
import { CorrespondDailogComponent } from './correspond-dailog/correspond-dailog.component';
import { UserSelectPopupComponent } from './user-select-popup/user-select-popup.component';
import { NumericDirective } from './matter-popup/numericValidation.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSortModule } from '@angular/material/sort';
import { FileNoteDialogComponent } from './file-note-dialog/file-note-dialog.component';
import { ApplicationPipesModule } from '../application-pipes.module';



const routes = [
  { path: '', component: MattersComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    MattersComponent,
    MattersListComponent,
    MattersSortDetailComponent,
    MatterPopupComponent,
    FileNoteDialogComponent,
    GeneralComponent,
    ClientComponent,
    RatesComponent,
    NumericDirective,

    // DetailsComponent,
    OthersComponent,
    // NewmatterDetailComponent,
    CriminalComponent,
    CommercialComponent,
    CompensationComponent,
    CompulsoryAcquisitionComponent,
    FamilyComponent,
    ImmigrationComponent,
    LeasingComponent,
    LitigationComponent,
    MaritimeComponent,
    MortgageFinanceComponent,
    PropertyPurchaseComponent,
    PropertyComponent,
    StrataComponent,
    TrademarkIPComponent,
    WillsEstateComponent,
    MatterAddressPopupComponent,
    AddressComponent,
    TitleComponent,
    CouncilComponent,
    CrownAllotmentComponent,
    CorrespondDailogComponent,
    UserSelectPopupComponent

  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    //mat 
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatAutocompleteModule,
    // MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
    MatGridListModule,
    DragDropModule,
    MatSortModule,
    ApplicationPipesModule
  ],
  exports: [
    MattersComponent,
    DragDropModule
  ],
  entryComponents: [MatterPopupComponent, FileNoteDialogComponent, MatterAddressPopupComponent, CorrespondDailogComponent, UserSelectPopupComponent]
})
export class MattersModule { }
