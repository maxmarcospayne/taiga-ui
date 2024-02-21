import {Component, inject} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TUI_IS_E2E} from '@taiga-ui/cdk';
import {of, timer} from 'rxjs';

@Component({
    selector: 'tui-progress-bar-example-2',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    encapsulation,
    changeDetection,
})
export class TuiProgressBarExample2 {
    private readonly isE2E = inject(TUI_IS_E2E);

    readonly fastValue$ = this.isE2E ? of(80) : timer(500, 100);
    readonly slowValue$ = this.isE2E ? of(4) : timer(500, 2000);
    readonly colors = [
        'var(--tui-support-01)',
        'var(--tui-support-21)',
        'lightskyblue',
        '#3682db',
        'var(--tui-primary)',
    ];
}
