import { NgModule } from '@angular/core';
import { InfiniteScrollDirective } from './infinite-scroll/infinite-scroll.directive';

@NgModule({
  declarations: [InfiniteScrollDirective],
  providers: [],
  exports: [InfiniteScrollDirective]
})

export class InfiniteScrollModule {}