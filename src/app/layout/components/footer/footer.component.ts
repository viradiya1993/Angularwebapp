import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
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
    VERSION: any = environment.VERSION;
    constructor() {
        this.currentYear = new Date().getFullYear();
    }
}
