import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { HiringManagerComponent } from '../hiring-manager.component';
import { HiringComponent } from '../../hiring.component';
import { DonutChartConfig } from '../../../../shared/charts/donutchart/donut-chart.component';
import { AreaChartConfig } from '../../../../shared/charts/areachart/area-chart.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './dashboard.component.html'
})
export class HiringManagerDashboard {
  offerSummaryChart: DonutChartConfig;
  requestsChart: DonutChartConfig;
  profileSummaryChart: AreaChartConfig;
  hiringRequestsChart: AreaChartConfig;
  offersChart: AreaChartConfig;
  onBoardingChart: AreaChartConfig;
  metricsData: any = [];
  catgData: any = [];
  practices: any = [{ id: "", name: "Select Practice" }];
  filterObject = { "month": "", "quarter": "", "year": "", "practice": "" };
  quarters: any[] = [{
    "display": "Select Quarter",
    "value": ""
  }, {
    "display": "Q1",
    "value": "Q1"
  }, {
    "display": "Q2",
    "value": "Q2"
  }, {
    "display": "Q3",
    "value": "Q3"
  }, {
    "display": "Q4",
    "value": "Q4"
  }];
  years: any[] = [{
    "display": "Select Year",
    "value": ""
  }, {
    "display": new Date().getFullYear().toString(),
    "value": new Date().getFullYear().toString()
  },
  {
    "display": (new Date().getFullYear() - 1).toString(),
    "value": (new Date().getFullYear() - 1).toString()
  },
  {
    "display": (new Date().getFullYear() - 2).toString(),
    "value": (new Date().getFullYear() - 2).toString()
  }];
  months: any[] = [{
    "description": "Select Month", "code": ''
  }, {
    "description": "January", "code": 1
  },
  {
    "description": "February", "code": 2
  },
  {
    "description": "March ", "code": 3
  },
  {
    "description": "April", "code": 4
  },
  {
    "description": "May", "code": 5
  },
  {
    "description": "June", "code": 6
  },
  {
    "description": "July", "code": 7
  },
  {
    "description": "August", "code": 8
  },
  {
    "description": "September", "code": 9
  },
  {
    "description": "October", "code": 10
  },
  {
    "description": "November", "code": 11
  },
  {
    "description": "December", "code": 12
  }]
  constructor(
    private hiringComponent: HiringComponent,
    /*private HiringManagerComponent:HiringManagerComponent,*/
    private hiringRequestDataService: NewHiringRequestDataService1,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Dashboard";
  }
  ngOnInit() {
    //this.generateHiringRequestChart();
    //this.generateOffersChart();
    //this.generateOnBoardingChart();
    //this.generateProfileSummaryChart();
    //this.generateMyRequestsChart();
    //this.generateAnnualOffersChart();
    this.hiringRequestDataService.getPractices().subscribe(res => {
      if (res && res._embedded && res._embedded.departments) {
        res._embedded.departments.forEach((ele: any) => {
          if (ele.practices.length) {
            this.practices = this.practices.concat(ele.practices);
          }
        });
      }
    }, error => {
      this.errorHandleService.handleErrors(error);
    });
    this.filterObject.year = new Date().getFullYear().toString();
    this.filterObject.quarter = '';
    this.filterObject.month = '';
    this.filterObject.practice = '';
    this.onFilterChange();
  }

  ngOnDestroy() {
    //$('.sidebar-menu').height('100%');
  }

  onFilterChange() {
    var self = this;
    this.metricsData.length = 0;
    self.loaderService.showLoading();
    this.hiringRequestDataService.getMetrics(this.filterObject.year, this.filterObject.quarter, this.filterObject.month, this.filterObject.practice).subscribe(data => {
      data.forEach((ele: any, i: any) => {
        this.catgData[i] = { ["category"]: ele['category'].replace("_", " "), 'metricsData': [] };
        // this.catgData[i]['metricsData'] =[];
        let data = ele['categoryMetrics'];
        data.forEach(function (elem: any, ind: any) {
          let dataPointsValues = Object.keys(elem["dataPoints"]).map(function (key) {
            return elem["dataPoints"][key];
          });
          let maxDataPoints = 0;
          (dataPointsValues).forEach((value) => {
            if (maxDataPoints < parseInt(value)) {
              maxDataPoints = parseInt(value);
            }
          });
          self.catgData[i].metricsData.push({
            name: elem['name'],
            target: elem['key'],
            height: 200,
            columns: self.getColumns(elem['chartType'], elem['dataPoints']),
            categories: self.getCategories(elem['chartType'], elem['dataPoints'], elem['name']),
            total: elem['total'],
            maxDataPoints: maxDataPoints
          });
        });
      });
      data = self.getResponse(data);
      data.forEach(function (elem: any, ind: any) {
        var dataPointsValues = Object.keys(elem["dataPoints"]).map(function (key) {
          return elem["dataPoints"][key];
        });
        var maxDataPoints = 0;
        (dataPointsValues).forEach((value) => {
          if (maxDataPoints < parseInt(value)) {
            maxDataPoints = parseInt(value);
          }
        });
        self.metricsData.push({
          name: elem['name'],
          target: elem['key'],
          height: 200,
          columns: self.getColumns(elem['chartType'], elem['dataPoints']),
          categories: self.getCategories(elem['chartType'], elem['dataPoints'], elem['name']),
          total: elem['total'],
          maxDataPoints: maxDataPoints
        });
      });
      self.loaderService.hideLoading();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  getResponse(data: any) {
    var response: any = [];
    data.forEach(function (elem: any, ind: any) {
      var category = elem['categoryMetrics'];
      category.forEach(function (ele: any, idx: any) {
        response.push(ele);
      });
    });
    return response;
  }
  getColumns(chartType: any, dataPoints: any) {
    var columns: any = [];
    if (chartType == 'Bar') {
      Object.keys(dataPoints).forEach(function (elem, ind) {
        var colList = [];
        colList.push(elem);
        colList.push(dataPoints[elem]);
        columns.push(colList);
      });
    } else if (chartType == 'CategoryBar') {
      var category = Object.keys(dataPoints)[0];
      Object.keys(dataPoints[category]).forEach(function (elem, ind) {
        var categoryList: any = [];
        var cat = elem;
        categoryList.push(elem);
        Object.keys(dataPoints).forEach(function (elem, ind) {
          categoryList.push(dataPoints[elem][cat]);
        });
        columns.push(categoryList);
      });
    }
    return columns;
  }
  getCategories(chartType: any, dataPoints: any, name: any) {
    if (chartType == 'Bar') {
      return [name];
    } else if (chartType == 'CategoryBar') {
      return Object.keys(dataPoints);
    }
  }
  generateOnBoardingChart() {
    this.onBoardingChart = {
      target: 'onBoardingChart',
      height: 200,
      tickCount: 3,
      data: ['Employee OnBoarding', 12, 8, 5, 5]
    }
  }
  generateOffersChart() {
    this.offersChart = {
      target: 'offersChart',
      height: 200,
      tickCount: 3,
      data: ['Offers', 12, 8, 5, 5]
    }
  }
  generateHiringRequestChart() {
    this.hiringRequestsChart = {
      target: 'hiringRequestsChart',
      height: 200,
      tickCount: 3,
      data: ['Hiring Requests', 12, 8, 5, 5]
    };
  }
  generateProfileSummaryChart() {
    this.profileSummaryChart = {
      target: 'profileSummaryChart',
      height: 200,
      tickCount: 3,
      data: ['Profiles Summary', 12, 8, 5, 5]
    };
  }
  generateMyRequestsChart() {
    this.requestsChart = {
      target: 'requestsChart',
      title: '12',
      height: 300,
      categories: 'Accepted,Offered,Joined,InProgress',
      data: [
        { "Accepted": 5 },
        { "Offered": 4 },
        { "Joined": 1 },
        { "InProgress": 2 }
      ]
    };
  }
  generateAnnualOffersChart() {
    this.offerSummaryChart = {
      target: 'offerSummaryChart',
      title: '36',
      height: 300,
      categories: 'Accepted,Offered,Joined,InProgress,Rejected,Not Joined,Cancelled',
      data: [
        { "Accepted": 10 },
        { "Offered": 5 },
        { "Joined": 5 },
        { "InProgress": 5 },
        { "Rejected": 6 },
        { "Not Joined": 2 },
        { "Cancelled": 3 }
      ]
    };
  }
  ngAfterViewChecked() {
    // var contentHeight = $('.content-wrapper').height();
    // $('.sidebar-menu').height(contentHeight+15);
  }
}