import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BehaviorService, MainAPiServiceService } from 'app/_services';

interface FoodNode {
    name: string;
    index?: number;
    children?: FoodNode[];
    SUBTOPICS?: FoodNode[];
    TOPICNAME:string;
    MainList?: FoodNode[];
  }
  /** Flat node with expandable and level information */
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }
  
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class TopicComponent implements OnInit {
    storeDataarray:any=[];
    Accountlist: FormGroup;
    isLoadingResults: boolean = false;
    highlightedRows: any;
    arrayForIndex: any = [];
    theme_type = localStorage.getItem('theme_type');
    selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
    index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
    private _transformer = (node: FoodNode, level: number) => {
      return {
        expandable: !!node.SUBTOPICS && node.SUBTOPICS.length > 0 ,
        name: node.TOPICNAME,
        SUBTOPICS: node.SUBTOPICS,
        // Context: node.CONTEXT,
        Main: node.MainList,
        // child: node.TEMPLATEFILE,
        // iconType: node.TEMPLATETYPEDESC,
        // KitGUid: node.KITGUID,
        index: node.index,
        level: level,
      };
    }
  
    treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);
    treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.SUBTOPICS);
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    pageSize: string;

    constructor(
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private behaviorService: BehaviorService,
        private _mainAPiServiceService: MainAPiServiceService,
      ) {
        // this.arrayForIndex = [];
        // // this.showData(TREE_DATA, 0, null);
        // this.dataSource.data = TREE_DATA;
        // this.highlightedRows = 1;
      }

  showData(element, level, parent) {
    element.forEach(x => {
      // this.MainKitArray=x;
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.MainList = x;
      x.index = this.arrayForIndex.length;
      if (x.SUBTOPICS)
      this.showData(x.SUBTOPICS,x.level + 1, x.TOPICNAME);
        // this.showData(x.SUBTOPICS, x.level + 1, x.TOPICNAME);
    });
  }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 50)) + 'px');
    this.Accountlist = this._formBuilder.group({
      AccountType: [''],
      searchFilter: [''],
      Matter: [''],
      Client: ['']
    });
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.Accountlist.controls['Matter'].setValue(mattersData.MATTER);
    this.Accountlist.controls['Client'].setValue(mattersData.CONTACTNAME);
    this.LoadData();

  }

  LoadData() {
    this.isLoadingResults = true;
     this._mainAPiServiceService.getSetData({}, 'GetTopic').subscribe(res => {
       if ((res.CODE == 200 || res.CODE == '200') && res.STATUS == "success") {
          this.arrayForIndex = [];
          this.storeDataarray = res.DATA.TOPICS;
          this.showData(this.storeDataarray, 0, null);
          this.dataSource.data = this.storeDataarray;
          this.editContact(this.storeDataarray[0]);
          this.highlightedRows = 1;
       }
       this.isLoadingResults = false;
     }, err => {
       this.toastr.error(err);
       this.isLoadingResults = false;
     });
     this.pageSize = localStorage.getItem('lastPageSize');
   }
   hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
   editContact(val) {
     this.behaviorService.MainTopicData(val);
   }
   refresMainTopic(){
     this.LoadData();
   }
}

