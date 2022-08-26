import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TuiDocExample} from '@taiga-ui/addon-doc';

@Component({
    selector: `example-action`,
    templateUrl: `./action.template.html`,
    changeDetection,
    encapsulation,
})
export class ExampleTuiActionComponent {
    readonly exampleModule = import(`./examples/import/import-module.md?raw`);
    readonly exampleHtml = import(`./examples/import/insert-template.md?raw`);

    readonly example1: TuiDocExample = {
        HTML: import(`./examples/1/index.html?raw`),
        TypeScript: import(`./examples/1/index.ts?raw`),
        LESS: import(`./examples/1/index.less?raw`),
    };

    readonly example2: TuiDocExample = {
        HTML: import(`./examples/2/index.html?raw`),
        TypeScript: import(`./examples/2/index.ts?raw`),
    };

    readonly iconVariants = [
        `tuiIconPrintLarge`,
        `tuiIconLoginLarge`,
        `tuiIconCalendarLarge`,
    ];

    icon = this.iconVariants[0];

    color = `var(--tui-link)`;
    background = `var(--tui-base-02)`;
}
