import {Directive} from '@angular/core';
import {tuiWithStyles} from '@taiga-ui/cdk';

import {TuiButtonGroupComponent} from './button-group.component';

@Directive({
    selector: '[tuiButtonGroup]',
})
export class TuiButtonGroupDirective {
    protected readonly nothing = tuiWithStyles(TuiButtonGroupComponent);
}
