import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    Input,
} from '@angular/core';
import {TUI_INPUT_CARD_OPTIONS} from '@taiga-ui/addon-commerce/components/input-card';
import {TuiPaymentSystem} from '@taiga-ui/addon-commerce/types';
import {TuiSizeS} from '@taiga-ui/core';

@Component({
    selector: 'tui-thumbnail-card',
    templateUrl: './thumbnail-card.template.html',
    styleUrls: ['./thumbnail-card.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiThumbnailCardComponent {
    private readonly options = inject(TUI_INPUT_CARD_OPTIONS);

    @Input()
    @HostBinding('class._active')
    active = false;

    @Input()
    brandLogo = '';

    @Input()
    cardNumber = '';

    @Input()
    paymentSystem: TuiPaymentSystem | null = null;

    @Input()
    @HostBinding('attr.data-size')
    size: TuiSizeS = 'm';

    get hasBrandLogo(): boolean {
        return !!this.brandLogo && this.size === 'm';
    }

    get paymentSystemLogo(): string {
        return this.paymentSystem ? this.options.icons[this.paymentSystem] : '';
    }
}
