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
  filterName: string;
  modelType: string;
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
    this.property = data.data;
  }
  ngOnInit(): void {
    this.updateCount();
  }
  updateCount() {
    this.checkboxdata = 0;
    this.property.forEach(itemsdata => {
      if (itemsdata.HIDDEN) {
        this.checkboxdata++;
      }
    });
    this.title = this.checkboxdata == 0 ? "Select All" : "Clear";
  }
  //when checkbox click here
  onChange(event, data) {
    let tempPropertyData = [];
    this.property.forEach(itemsdata => {
      if (itemsdata.COLUMNNAME == data) {
        itemsdata.HIDDEN = event.checked ? 1 : 0;
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
      if (itemsdata.COLUMNNAME == item) {
        itemsdata.HIDDEN = event.checked ? 1 : 0;
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
      itemsdata.HIDDEN = isCheck ? 1 : 0;
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
    this.property.forEach(itemsdata => {
      if (itemsdata.HIDDEN == 1)
        showCol.push(itemsdata.COLUMNNAME);
    });
    this.saveLastFilter();
    this.dialogRef.close({ columObj: showCol, columnameObj: this.property });
  }
  saveLastFilter() {
    let dataObj = [];
    this.property.forEach(itemsdata => {
      dataObj.push({ COLUMNNAME: itemsdata.COLUMNID, HIDDEN: itemsdata.HIDDEN, POSITION: itemsdata.POSITION });
    });
    this.TableColumnsService.setTableFilter(this.modelType, dataObj).subscribe(response => { if (response.CODE == 200 && response.STATUS == "success") { console.log('save'); } }, error => {
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
      return it.COLUMNNAME.toLowerCase().includes(nameToFilter);
    });
  }
}