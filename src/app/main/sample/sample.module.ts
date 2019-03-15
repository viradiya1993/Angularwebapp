import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../_guards';
import { SampleComponent } from './sample.component';

const routes = [{
    path: 'sample',
    component: SampleComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule
    ],
    exports: [
        SampleComponent
    ]
})

export class SampleModule {
}
