import { Component, OnInit, Pipe, PipeTransform, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sorting-dialog',
  templateUrl: './sorting-dialog.component.html',
  styleUrls: ['./sorting-dialog.component.scss']
})
export class SortingDialogComponent implements OnInit {

  //For Dropdown and check box value  
  //property = ["annual revenue","associated company","associated deals","become a customer date","become a lead date","become a marketing qualified lead date","for testing"];    
  property: any[] = [];
  filterName: string;
  modelType: string;
  searchporoperty: string;
  noReturnPredicate: string;
  namesFiltered = [];
  // drag and dropcode:
  all = [];
  even = [];
  constructor(public dialogRef: MatDialogRef<SortingDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.modelType = data.type;
    data.data.forEach(items => {
      this.property.push({ 'value': items, 'checked': false });
    });
  }

  ngOnInit(): void {
  }

  //when checkbox click here
  onChange(event, data) {
    if (event.checked == true) {
      if (this.all.indexOf(data) == -1) {
        this.all.push(data);
      }
    } else if (event.checked == false) {
      if (this.all.indexOf(data) != -1) {
        this.all.splice(this.all.indexOf(data), 1);
      }
    }
  }
  //data drag and drop
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  //data close icon click after delete
  public indeterminate: boolean = false;
  remove(item, event) {
    this.all.splice(this.all.indexOf(item), 1);
    this.property.forEach(items => {
      if (items.checked == true) {
        if (items.value == item) {
          items.checked = false;
        }
      }
    });
  }
  //Delete all columns click after delete all data 
  deleteall(item, event) {
    const checked = event.target.checked;
    this.property.forEach(item => {
      item.checked = false
      this.all.splice(item);
    });
  }

  //dialog content close event
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  //dialog content close event with save
  ondialogSaveClick(): void {
    this.dialogRef.close(this.all);
  }

}
@Pipe({ name: 'filterByName' })
export class filterNames implements PipeTransform {
  transform(listOfNames: any[], nameToFilter: string): any[] {
    if (!listOfNames) return [];
    if (!nameToFilter) return listOfNames;
    nameToFilter = nameToFilter.toLowerCase();
    return listOfNames.filter(it => {
      return it.value.toLowerCase().includes(nameToFilter);
    });
  }
}
