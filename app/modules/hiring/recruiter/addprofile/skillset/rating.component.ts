import { Component, OnInit, Input, Output, HostListener, Self, EventEmitter } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ControlValueAccessor, NgModel } from '@angular/forms';

@Component({
    selector: 'rating',
    providers: [NgModel],
    templateUrl: 'rating.component.html'
})

export class Rating implements ControlValueAccessor, OnInit {
    @Input() public max: number;
    @Input() public stateOn: string;
    @Input() public stateOff: string;
    @Input() public readonly: boolean;
    @Input() public titles: Array<string>;
    @Input() public ratingStates: Array<{ stateOn: string, stateOff: string }>;
    @Output() public onHover: EventEmitter<any> = new EventEmitter();
    @Output() public onLeave: EventEmitter<any> = new EventEmitter();
    public range: Array<any>;
    public value: number;
    public preValue: number;

    @HostListener('keydown', ['$event'])
    public onKeydown(event: KeyboardEvent) {
        if ([37, 38, 39, 40].indexOf(event.which) === -1) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        let sign = event.which === 38 || event.which === 39 ? 1 : -1;
        this.rate(this.value + sign);
    }

    constructor( @Self() public cd: NgModel) {
        cd.valueAccessor = this;
    }

    ngOnInit() {
        this.max = typeof this.max !== 'undefined' ? this.max : 5;
        this.readonly = this.readonly === true;
        this.stateOn = typeof this.stateOn !== 'undefined' ? this.stateOn : 'glyphicon-star';
        this.stateOff = typeof this.stateOff !== 'undefined' ? this.stateOff : 'glyphicon-star-empty';
        this.titles = typeof this.titles !== 'undefined' && this.titles.length > 0 ? this.titles : ['one', 'two', 'three', 'four', 'five'];
        this.range = this.buildTemplateObjects(this.ratingStates, this.max);
    }

    writeValue(value: number) {
        if (value % 1 !== value) {
            this.value = Math.round(value);
            this.preValue = value;
            return;
        }
        this.preValue = value;
        this.value = value;
    }

    public buildTemplateObjects(ratingStates: Array<any>, max: number) {
        ratingStates = ratingStates || [];
        let count = ratingStates.length || max;
        let result: any[] = [];
        for (let i = 0; i < count; i++) {
            result.push(Object.assign({
                rangeIndex: i,
                stateOn: this.stateOn,
                stateOff: this.stateOff,
                title: this.titles[i] || i + 1
            }, ratingStates[i] || {}));
        }
        return result;
    }

    public rate(value: number) {
        if (!this.readonly && value >= 0 && value <= this.range.length) {
            this.writeValue(value);
            this.cd.viewToModelUpdate(value);
        }
    }
    public enter(value: number) {
        if (!this.readonly) {
            this.value = value;
            this.onHover.emit(value);
        }
    }
    public reset() {
        this.value = this.preValue;
        this.onLeave.emit(this.value);
    }

    onChange = (_: any) => {
    };
    onTouched = () => {
    };

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}
