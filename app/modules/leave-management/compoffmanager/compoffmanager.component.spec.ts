import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveManagementService } from '../leave-management.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { AgGridModule } from 'ag-grid-angular';
import { PaginatorModule } from 'primeng/paginator';

import {
  MockLeaveManagementService, MockLoaderService, MockCommonService
} from './../../../../mock/mock.service';
import { CompoffmanagerComponent } from './compoffmanager.component';

xdescribe('CompoffmanagerComponent', () => {
  let component: CompoffmanagerComponent;
  let fixture: ComponentFixture<CompoffmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoffmanagerComponent ],
      imports: [ AgGridModule, PaginatorModule ],
      providers: [
        { provide: LeaveManagementService, useClass: MockLeaveManagementService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: CommonService, useClass: MockCommonService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoffmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
