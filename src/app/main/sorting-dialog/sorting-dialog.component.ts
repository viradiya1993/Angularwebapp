import { Component, OnInit, Pipe, PipeTransform, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sorting-dialog',
  templateUrl: './sorting-dialog.component.html',
  styleUrls: ['./sorting-dialog.component.scss']
})
export class SortingDialogComponent implements OnInit {
  checkboxdata : any;
  //For Dropdown and check box value  
  //property = ["annual revenue","associated company","associated deals","become a customer date","become a lead date","become a marketing qualified lead date","for testing"];    
  property: any[] = [];
  filterName: string;
  modelType: string;
  searchporoperty: string;
  noReturnPredicate: string;
  title: string;
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
    this.checkboxdata= JSON.parse(localStorage.getItem(this.modelType)); 
    if(this.checkboxdata.length==0){this.title="Select All"}else{this.title="Clear"}
    //console.log(this.checkboxdata);   
    //Save Button Click After
    if(this.checkboxdata){
        this.checkboxdata.forEach(items => { 
          this.property.forEach(itemsdata => {
            if(itemsdata.value==items && itemsdata.checked == false){
              itemsdata.checked=true;
              if (this.all.indexOf(items) == -1) {
                this.all.push(items);
              }
            }            
          });
        });
      }
     else{
      this.property.forEach(itemsdata => {
        itemsdata.checked=true;
        if (this.all.indexOf(itemsdata.value) == -1) {
          this.all.push(itemsdata.value);
        }
      });
     }  
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
  deleteall() { 
    console.log(this.all.length);
    if(this.all.length==0){
    this.title="Clear"
    this.property.forEach(item => {
        item.checked = true
        this.all.push(item.value);
        });
    }else{
    this.property.forEach(item => {
        item.checked = false
        this.all.splice(item);        
        });
        this.title="Select All";
    }
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