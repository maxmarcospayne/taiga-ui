import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    inject,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {
    AbstractTuiControl,
    EMPTY_QUERY,
    tuiClamp,
    TuiFocusableElementAccessor,
    tuiIsNativeFocusedIn,
    TuiNativeFocusableElement,
    tuiPure,
    tuiQuantize,
} from '@taiga-ui/cdk';
import {TuiSizeS, TuiWithOptionalMinMax} from '@taiga-ui/core';
import {TuiSliderComponent} from '@taiga-ui/kit/components/slider';
import {TuiKeySteps} from '@taiga-ui/kit/types';
import {
    tuiKeyStepValueToPercentage,
    tuiPercentageToKeyStepValue,
} from '@taiga-ui/kit/utils';

@Component({
    selector: 'tui-range',
    templateUrl: './range.template.html',
    styleUrls: ['./range.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.tabindex]': '-1',
        '[attr.aria-disabled]': 'computedDisabled',
    },
})
export class TuiRangeComponent
    extends AbstractTuiControl<[number, number]>
    implements TuiWithOptionalMinMax<number>, TuiFocusableElementAccessor
{
    private readonly el: HTMLElement = inject(ElementRef).nativeElement;

    @Input()
    min = 0;

    @Input()
    max = 100;

    @Input()
    step = 1;

    @Input()
    @HostBinding('attr.data-size')
    size: TuiSizeS = 'm';

    @Input()
    segments = 1;

    @Input()
    keySteps: TuiKeySteps | null = null;

    @ViewChildren(TuiSliderComponent, {read: ElementRef})
    slidersRefs: QueryList<ElementRef<HTMLInputElement>> = EMPTY_QUERY;

    lastActiveThumb: 'left' | 'right' = 'right';

    get nativeFocusableElement(): TuiNativeFocusableElement | null {
        const [sliderLeftRef, sliderRightRef] = this.slidersRefs;

        if (
            this.computedDisabled ||
            !this.focusable ||
            !sliderLeftRef ||
            !sliderRightRef
        ) {
            return null;
        }

        const isLeftThumbLocked = this.right === 100;

        return isLeftThumbLocked
            ? sliderRightRef.nativeElement
            : sliderLeftRef.nativeElement;
    }

    get focused(): boolean {
        return tuiIsNativeFocusedIn(this.el);
    }

    get fractionStep(): number {
        return this.step / (this.max - this.min);
    }

    get computedKeySteps(): TuiKeySteps {
        return this.computePureKeySteps(this.keySteps, this.min, this.max);
    }

    get segmentWidthRatio(): number {
        return 1 / this.segments;
    }

    @HostBinding('style.--left.%')
    get left(): number {
        return this.getPercentageFromValue(this.value[0]);
    }

    @HostBinding('style.--right.%')
    get right(): number {
        return 100 - this.getPercentageFromValue(this.value[1]);
    }

    @HostListener('focusin', ['true'])
    @HostListener('focusout', ['false'])
    onFocused(focused: boolean): void {
        this.updateFocused(focused);
    }

    @HostListener('keydown.arrowUp.prevent', ['1', '$event.target'])
    @HostListener('keydown.arrowRight.prevent', ['1', '$event.target'])
    @HostListener('keydown.arrowLeft.prevent', ['-1', '$event.target'])
    @HostListener('keydown.arrowDown.prevent', ['-1', '$event.target'])
    changeByStep(coefficient: number, target: HTMLElement): void {
        const [sliderLeftRef, sliderRightRef] = this.slidersRefs;
        const leftThumbElement = sliderLeftRef.nativeElement;
        const rightThumbElement = sliderRightRef.nativeElement;

        const isRightThumb =
            target === this.el
                ? this.lastActiveThumb === 'right'
                : target === rightThumbElement;
        const activeThumbElement = isRightThumb ? rightThumbElement : leftThumbElement;
        const previousValue = isRightThumb ? this.value[1] : this.value[0];
        /** @bad TODO think about a solution without twice conversion */
        const previousFraction = this.getPercentageFromValue(previousValue) / 100;
        const newFractionValue = previousFraction + coefficient * this.fractionStep;

        this.processValue(this.getValueFromFraction(newFractionValue), isRightThumb);

        if (activeThumbElement) {
            activeThumbElement.focus();
        }
    }

    processValue(value: number, right: boolean): void {
        if (right) {
            this.updateEnd(value);
        } else {
            this.updateStart(value);
        }

        this.lastActiveThumb = right ? 'right' : 'left';
    }

    getValueFromFraction(fraction: number): number {
        const guardedFraction = tuiClamp(tuiQuantize(fraction, this.fractionStep), 0, 1);

        return tuiPercentageToKeyStepValue(guardedFraction * 100, this.computedKeySteps);
    }

    getPercentageFromValue(value: number): number {
        return tuiKeyStepValueToPercentage(value, this.computedKeySteps);
    }

    protected getFallbackValue(): [number, number] {
        return [0, 0];
    }

    @tuiPure
    private computePureKeySteps(
        keySteps: TuiKeySteps | null,
        min: number,
        max: number,
    ): TuiKeySteps {
        return (
            keySteps || [
                [0, min],
                [100, max],
            ]
        );
    }

    private updateStart(value: number): void {
        this.value = [Math.min(value, this.value[1]), this.value[1]];
    }

    private updateEnd(value: number): void {
        this.value = [this.value[0], Math.max(value, this.value[0])];
    }
}
