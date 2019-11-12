
export interface NewHiringRequestDetails {
    "primaryHiringDetails": {
        "hiringReason": "string",
        "clientId": "number",
        "departmentId": "number",
        "hiringType": "string",
        "hiringManager": "number",
        "hiringPriority": "string",
        "profileScreeningMembers": "string[]"
    },
    "secondaryHiringDetails": [{
        "needNumber": "number",
        "needDetails": {
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
            "jobDescription": "string",
            "interviewPanels": [{
            "panelNumber": "number",
                "name": "string",
                "level": "string",
                "panelMembers": "string[]",
                "selectionCriterion": "string[]"
            }]
        }
    }]
}