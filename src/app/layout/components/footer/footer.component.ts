import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    /**
     * Constructor
     */
    currentYear: any;
    constructor() {
        this.currentYear = new Date().getFullYear();
    }
}
