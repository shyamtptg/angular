import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
};

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0
};

@Directive({
  selector: '[infinite-scroll]'
})
export class InfiniteScrollDirective implements AfterViewInit {

  scrollEvent: any;

  userScrolledDown: any;

  requestOnScroll: any;

  requestStream: any;

  @Input()
  scrollCallback: any;

  @Input()
  immediateCallback: any;


  constructor(private elm: ElementRef) { }

  ngAfterViewInit() {
    this.registerScrollEvent();
    this.streamScrollEvents();
    this.requestCallbackOnScroll();
  }

  registerScrollEvent() {
    this.scrollEvent = Observable.fromEvent(this.elm.nativeElement, 'scroll');
  }

  streamScrollEvents() {
    this.userScrolledDown = this.scrollEvent
      .map((e: any): ScrollPosition => ({
        sH: e.target.scrollHeight,
        sT: e.target.scrollTop,
        cH: e.target.clientHeight
      }))
      .pairwise()
      .filter((positions:any) => this.isUserScrollingDown(positions) && this.isScrollEndOfPage(positions[1]))
  }

  requestCallbackOnScroll(){
    this.requestOnScroll = this.userScrolledDown;

    if (this.immediateCallback) {
      this.requestOnScroll = this.requestOnScroll
        .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
    }

    this.requestOnScroll
      .exhaustMap(() => {
        return this.scrollCallback();
      }).subscribe((data: any) => {}, (err: any) => {
        return Observable.throw(new Error(err.message));
      });
  }

  isUserScrollingDown = (positions: any) => {
    return positions[0].sT < positions[1].sT;
  }

  isScrollEndOfPage = (position: any) => {
    return (position.sH - position.sT === position.cH);
  }

}
