export interface HiringRequestDetails {
    "primaryHiringDetails": {
        "hiringFor": "string",
        "clientName": "string",
        "department": "string",
        "hiringType": "string",
        "hiringManager": "string",
        "priority": "string"
        //"model": "string"
    },
    "secondaryHiringDetails": {
        "practice": "string",
        "competency": "string",
        "workLocation": "string",
        "experienceReq": {
            "from": "number",
            "to": "number"
        },
        "expectedRole": "string",
        "numberOfResources": "string",
        "expectedStartDate": "string",
        "model": "string",
        "jobDescription": "string"
    },
    "interviewPanels": [{
        "panelNumber": "number",
        "name": "string",
        "level": "string",
        //"practice": "string",
        //"department": "string",
        "panelMembers": "string[]",
        //"interviewDate": "string",
        "selectionCriterion": "string[]"
    }]
}