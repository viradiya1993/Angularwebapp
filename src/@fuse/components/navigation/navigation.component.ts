import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Pipe, PipeTransform } from '@angular/core';

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

  page: any[] = [
    { id: 'matters', title: 'Matters', type: 'item', icon: 'icon_matter_d.ico', url: 'matters', star: '' },
    { id: 'contact', title: 'Contact', type: 'item', icon: 'icon_contact_d.ico', url: 'contact', star: '' },
    //{ id: 'time_entries', title: 'Timen entries', type: 'item', icon: 'icon_time_cost_new_d.ico', url: 'time-entries', star: '' },
    { id: 'diary', title: 'Diary', type: 'item', icon: 'icon_diary_d.ico', url: 'diary', star: '' },
    // { id: 'legal_details', title: 'Legal details', type: 'item', icon: 'icon_authorities_d.ico', url: 'legal-details', star: '' },
    // { id: 'time_billing', title: 'Time billing', type: 'item', icon: 'icon_invoice_d.ico', url: 'time-billing', star: '' },
   
  ];
  filterName: string;
  searchpage: string;
  //All pages array
  pagesall = [];
  user: any;


  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {FuseNavigationService} _fuseNavigationService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseNavigationService: FuseNavigationService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
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
    this.user = JSON.parse(localStorage.getItem('names'));
    if (this.user) {
      this.user.forEach(items => {
        this.onChange(items.title);
      });
    }
  }


  //For click
  onChange(values) {
    //find length available or not
    var index = this.pagesall.findIndex(function (item, i) {
      return item.title === values
    });
    if (index == -1) {
      //this.pagesall.push(values);         
      this.page.forEach(items => {
        if (items.star == '') {
          if (items.title == values) {
            items.star = 'star';
            this.pagesall.push({ id: items.id, title: items.title, translate: items.translate, type: items.type, icon: items.icon, url: items.url, star: items.star });
          } else {
            items.star = '';
          }
        }
      })
    }
    else {
      this.page.forEach(items => {
        if (items.star == 'star') {
          if (items.title == values) {
            items.star = '';
            this.pagesall.splice(index, 1);
          }
        }
      })
    }
    localStorage.setItem("names", JSON.stringify(this.pagesall));
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
      return it.title.toLowerCase().includes(nameToFilter);
    });
  }
}