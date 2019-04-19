import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Pipe, PipeTransform } from '@angular/core';
import { GetFavouriteService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'fuse-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit {
  @Input()
  layout = 'vertical';

  @Input()
  navigation: any;
  filterName: string;
  searchpage: string;
  //All pages array
  user: any;
  page: any = [];
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {FuseNavigationService} _fuseNavigationService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseNavigationService: FuseNavigationService,
    public GetFavouriteService: GetFavouriteService,
    private toastr: ToastrService
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    let guid = JSON.parse(localStorage.getItem('currentUser'));
    if (guid) {
      let postdata = { 'USERGUID': guid.UserGuid };
      this.GetFavouriteService.GetFavourite(postdata).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          response.DATA.FAVOURITES.forEach(items => {
            this.page.push({ "ID": items.ID, "TITLE": items.TITLE, "URL": items.URL, "STAR": items.STAR, "POSITION": items.POSITION, "type": "item", "icon": "icon_matter_d.ico" });
          });
        }
      }, error => {
        this.toastr.error(error);
      });
    }

  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  ngOnInit(): void {

    // Load the navigation either from the input or from the service

    this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

    // Subscribe to the current navigation changes
    this._fuseNavigationService.onNavigationChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Load the navigation
        this.navigation = this._fuseNavigationService.getCurrentNavigation();
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to navigation item
    merge(
      this._fuseNavigationService.onNavigationItemAdded,
      this._fuseNavigationService.onNavigationItemUpdated,
      this._fuseNavigationService.onNavigationItemRemoved
    ).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    //Localstorage Data Get and start Display
    // this.user = JSON.parse(localStorage.getItem('names'));
    // if (this.user) {
    //   this.user.forEach(items => {        
    //     this.onChange(items.TITLE);
    //   });
    // }

  }


  //For click
  onChange(values) {
    this.page.forEach(items => {
      if (items.STAR == '') {
        if (items.TITLE == values) {
          items.STAR = 'star';
        } else {
          items.STAR = '';
        }
      } else {
        if (items.TITLE == values) {
          items.STAR = '';
        }
      }
    })

    let guid = JSON.parse(localStorage.getItem('currentUser'));
    if (guid) {
      let favouritedatas = { 'USERGUID': guid.UserGuid, "ACTION": "replace", "FAVOURITES": this.page }
      this.GetFavouriteService.setFavourite(favouritedatas).subscribe(response => {
        console.log(response);
        if (response.CODE == 200 && response.STATUS == "success") {
          // this.toastr.error(error);    
        }
      }, error => {
        this.toastr.error(error);
      });
    }

  }
  ngAfterViewInit() {
    setTimeout(function () {
      $(".mat-input-element").trigger('click');
    }, 5000);
    this.changeIcon();
  }
  //clear textbox 
  clearSearch() {
    this.searchpage = null;
  }
  //change icon
  icon = 'search';
  changeIcon() {
    if (this.icon === 'search') {
      this.icon = 'close';
    } else {
      this.icon = 'search'
    }
  }
}
@Pipe({ name: 'filterByName' })
export class filterNames implements PipeTransform {

  // For Old Code
  // transform(listOfNames: any[], nameToFilter: string): any[] { 
  //   if(!listOfNames) return [];
  //   if(!nameToFilter) return listOfNames;    
  //   nameToFilter = nameToFilter.toLowerCase();
  //       return listOfNames.filter( it => {
  //         return it.value.toLowerCase().includes(nameToFilter);
  //       });
  // } 

  transform(page: any[], nameToFilter: string): any[] {
    if (!page) return [];
    if (!nameToFilter) return [];
    nameToFilter = nameToFilter.toLowerCase();
    return page.filter(it => {
      //console.log(it);
      return it.TITLE.toLowerCase().includes(nameToFilter);
    });
  }
}


