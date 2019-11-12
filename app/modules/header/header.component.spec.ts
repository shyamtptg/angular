import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from './../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { CommonService } from '../../shared/services/common.service';
import { AppConstants } from '../../config/app.constants';
import { HeaderService } from './/header.service';
import { DialogService } from './../../shared/dialogs/dialog.service';
import { DialogModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MockAuthService,
  MockLoaderService,
  MockDialogService,
  MockAppConstants,
  MockCommonService,
  MockHeaderService
} from './../../../mock/mock.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        DialogModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: AuthService, useClass: MockAuthService},
        {provide: LoaderService, useClass: MockLoaderService},
        {provide: CommonService, useClass: MockCommonService},
        {provide: AppConstants, useClass: MockAppConstants},
        {provide: HeaderService, useClass: MockHeaderService},
        {provide: DialogService, useClass: MockDialogService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
