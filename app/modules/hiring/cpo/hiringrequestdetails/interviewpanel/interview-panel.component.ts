import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewHiringRequestDataService1 } from '../../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
	selector: 'cpo-interview-panel',
	templateUrl: './interview-panel.component.html'
})


export class CPOInterviewPanel implements OnInit{
	panelsTagTitle: string = "Add Panel Member(s)";
	criterionTagTitle: string = "Add Selection Criterion";
	disableButton: boolean = false;
	public interviewLevel: any;
	public panelMembersMap: any;
	public criteriaMap: any;
	public viewMode: boolean = true;
	@Input() panelDetails: any;
	@Input() panelLevel: any;
	@Input() panelMemberTags: any;
	@Output() newPanel = new EventEmitter<number>();
	@Output() next = new EventEmitter();
	@Output() back = new EventEmitter();
	@Output() remove = new EventEmitter<number>();
	@Output() disable = new EventEmitter<boolean>();
	constructor(private hiringRequestDataService: NewHiringRequestDataService1,
		private router: Router,
		private route: ActivatedRoute,
		private dialogService: DialogService,
		private errorHandleService: ErrorHandleService
	
	) { }
	ngOnInit() {
		var self = this;
		var data = self.hiringRequestDataService.getHiringCombos();
		if (data) {
			self.interviewLevel = data['INTERVIEW_LEVEL'];
		}
		self.panelDetails.level = self.panelDetails.level;
		var criteriaObj = {};
		var interviewPanelCriterion: any = [];
		if (data['INTERVIEW_CRITERIA']) {
			data['INTERVIEW_CRITERIA'].forEach(function (ele: any, ind: any) {
				criteriaObj[ele.id] = ele.title;
				interviewPanelCriterion.push({
					'id': ele.id,
					'name': ele.title
				});
			});
			self.criteriaMap = criteriaObj;
		}
		self.hiringRequestDataService.getPanelMembers().subscribe(data => {
			var panelMemberObj = {};
			var interviewPanelMembers: any = [];
			if (data['_embedded'] && data['_embedded']['employees']) {
				data['_embedded']['employees'].forEach(function (ele: any, ind: any) {
					panelMemberObj[ele.id] = ele.fullName;
					interviewPanelMembers.push({
						'id': ele.id,
						'name': ele.fullName
					});
				});
				self.panelMembersMap = panelMemberObj;
			}
			var panelMembers: any = [];
			self.panelDetails.panelMembers && self.panelDetails.panelMembers.forEach(function (element: any, index: any) {
			  if(self.panelMembersMap[element['id']]){
				panelMembers.push(self.panelMembersMap[element['id']]);
			  }
			});
			self.panelDetails.panelMembers = panelMembers;
			var panelCriterion: any = [];
			self.panelDetails.panelCriteria && self.panelDetails.panelCriteria.forEach(function (element: any, index: any) {
			  if(self.criteriaMap[element['id']]){
				panelCriterion.push(self.criteriaMap[element['id']]);
			  }
			});
			self.panelDetails.selectionCriterion = panelCriterion;
			self.panelMemberTags = {
				'panelMembers': interviewPanelMembers,
				'panelCriterion': interviewPanelCriterion
			}
		}, error => {
			self.errorHandleService.handleErrors(error);
		});
	}
	saveAddNew() {
		this.newPanel.emit();
	}
	loadHiringRequestSummary() {
		this.next.emit();
	}
	loadHiringDetails() {
		this.back.emit();
	}
	removePanel() {
		this.remove.emit();
	}
	loadPanelMembers(items: any) {
		var panelMembers = this.panelDetails.panelMembers;
		if (panelMembers && panelMembers.length > 0) {
			items.forEach(function (elem: any, ind: any) {
				panelMembers.push(elem);
			});
			this.panelDetails.panelMembers = this.removeDuplicatesStringsFromArray(panelMembers);
		} else {
			this.panelDetails.panelMembers = items;
		}
	}
	loadSelectionCriterion(items: any) {
		var selectionCriterion = this.panelDetails.selectionCriterion;
		if (selectionCriterion && selectionCriterion.length > 0) {
			items.forEach(function (elem: any, ind: any) {
				selectionCriterion.push(elem);
			});
			this.panelDetails.selectionCriterion = this.removeDuplicatesStringsFromArray(selectionCriterion);
		} else {
			this.panelDetails.selectionCriterion = items;
		}
	}
	removeDuplicatesStringsFromArray(a: string[]) {
		var out = [],
			obj = {},
			len = a.length,
			k = 0;
		for (var i = 0; i < len; i++) {
			var item = a[i];
			if (obj[item] !== 1) {
				obj[item] = 1;
				out[k++] = item;
			}
		}
		return out;
	}
	ngAfterContentChecked() {
		this.disableButton = $('.interview-panel-form').hasClass('ng-invalid');
		this.disable.emit(this.disableButton);
	}
}