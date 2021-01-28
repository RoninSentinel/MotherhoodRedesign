import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {

    @Input('autoFocus') public isFocused: boolean;

    public constructor(private el: ElementRef) {

    }

    public ngAfterContentInit() {

        setTimeout(() => {
            if (this.isFocused) {
                this.el.nativeElement.focus();
            }
        }, 500);

    }

}