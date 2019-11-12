import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Idle} from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './shared/services/auth.service';
import { LoaderService } from './shared/services/loader.service';
import { DialogService } from './shared/dialogs/dialog.service';
import { Observable } from 'rxjs';
import { MockAuthService, MockLoaderService, MockDialogService } from './../mock/mock.service';

class IdleMock {
  test: string = 'test';
  onTimeout = Observable.create((observer) => {
    observer.complete();
  });

  setIdle() {
    return 100;
  }
  setTimeout() {
    return true;
  }
  setInterrupts() {
    return true;
  }
  watch() {
    return true;
  }
}
class KeepaliveMock {
  test: string = 'test';
  setIdle() {
    return 100;
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let originalTimeout: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: Idle, useClass: IdleMock },
        { provide: Keepalive, useClass: KeepaliveMock },
        { provide: AuthService, useClass: MockAuthService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: DialogService, useClass: MockDialogService }
      ]
    }).compileComponents();

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
