import { Component, OnInit, Pipe, PipeTransform, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TableColumnsService } from '../../_services';


@Component({
  selector: 'app-sorting-dialog',
  templateUrl: './sorting-dialog.component.html',
  styleUrls: ['./sorting-dialog.component.scss']
})
export class SortingDialogComponent implements OnInit {
  checkboxdata: number = 0;
  property: any[] = [];
  propertyNew: any[] = [];
  filterName: string;
  modelType: string;
  list: string;
  searchporoperty: string;
  noReturnPredicate: string;
  title: string;
  namesFiltered = [];
  even = [];
  constructor(
    private TableColumnsService: TableColumnsService,
    public dialogRef: MatDialogRef<SortingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.modelType = data.type;
    this.list = data.list;
    this.propertyNew = data.data;
    console.log(data.data);
  }
  ngOnInit(): void {
    this.property = this.propertyNew.sort(function (a, b) {
      return a.HIDDEN - b.HIDDEN;
    });
    this.updateCount();
  }
  updateCount() {
    this.checkboxdata = 0;
    this.property.forEach(itemsdata => {
      if (!itemsdata.HIDDEN) {
        this.checkboxdata++;
      }
    });
    this.title = this.checkboxdata == 0 ? "Select All" : "Clear";
  }
  //when checkbox click here
  onChange(event, data) {
    let tempPropertyData = [];
    this.property.forEach(itemsdata => {
      if (itemsdata.DESCRIPTION == data) {
        itemsdata.HIDDEN = event.checked ? 0 : 1;
        tempPropertyData.push(itemsdata);
      } else {
        tempPropertyData.push(itemsdata);
      }
    });
    this.property = tempPropertyData;
    this.updateCount();
  }
  //data drag and drop
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  remove(item, event) {
    let tempPropertyData = [];
    this.property.forEach(itemsdata => {
      if (itemsdata.DESCRIPTION == item) {
        itemsdata.HIDDEN = event.checked ? 0 : 1;
        tempPropertyData.push(itemsdata);
      } else {
        tempPropertyData.push(itemsdata);
      }
    });
    this.property = tempPropertyData;
    this.updateCount();
  }

  //Delete all columns click after delete all data 
  deleteall() {
    this.title = this.checkboxdata == 0 ? "Clear" : "Select All";
    let temCheck = this.checkboxdata == 0 ? true : false;
    this.clearfilter(temCheck);
    this.updateCount();
  }
  clearfilter(isCheck: boolean) {
    let tempPropertyData = [];
    this.property.forEach(itemsdata => {
      itemsdata.HIDDEN = isCheck ? 0 : 1;
      tempPropertyData.push(itemsdata);
    });
    this.property = tempPropertyData;
  }

  //dialog content close event
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  //dialog content close event with save
  ondialogSaveClick(): void {
    let showCol = [];
    let tempColobj = [];
    this.property.forEach(itemsdata => {
      tempColobj[itemsdata.COLUMNID] = itemsdata;
      if (itemsdata.HIDDEN == 0)
        showCol.push(itemsdata.COLUMNID);
    });
    this.saveLastFilter();
    this.dialogRef.close({ columObj: showCol, columnameObj: this.property, tempColobj: tempColobj });
  }
  saveLastFilter() {
    let dataObj = [];
    let POSITIONData = 1;
    this.property.forEach(itemsdata => {
      dataObj.push({ COLUMNNAME: itemsdata.COLUMNNAME, HIDDEN: itemsdata.HIDDEN, POSITION: POSITIONData });
      POSITIONData++;
    });
    this.TableColumnsService.setTableFilter(this.modelType, this.list, dataObj).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") { }
    }, error => {
      console.log(error);
    });
  }
}
@Pipe({ name: 'filterByName' })
export class filterNames implements PipeTransform {
  transform(listOfNames: any[], nameToFilter: string): any[] {
    if (!listOfNames) return [];
    if (!nameToFilter) return listOfNames;
    nameToFilter = nameToFilter.toLowerCase();
    return listOfNames.filter(it => {
      return it.DESCRIPTION.toLowerCase().includes(nameToFilter);
    });
  }
}