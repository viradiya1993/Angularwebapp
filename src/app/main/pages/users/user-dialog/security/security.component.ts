import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';



/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() userForm: FormGroup;
  displayMode: string = 'default';
  multi = false;
  hideToggle = false;
  disabled = false;
  showPanel3 = true;
  expandedHeight: string;
  collapsedHeight: string;
  constructor() {
  }
  ngOnInit() {
    console.log(JSON.parse(localStorage.getItem('edit_userPermission')));
  }

}
