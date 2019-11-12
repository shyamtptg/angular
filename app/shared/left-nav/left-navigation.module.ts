import { NgModule } from '@angular/core';
import { LeftNavigationDirective } from './LeftNavigation/left-navigation.directive';

@NgModule({
  declarations: [LeftNavigationDirective],
  providers: [],
  exports: [LeftNavigationDirective]
})

export class LeftNavigationModule {}