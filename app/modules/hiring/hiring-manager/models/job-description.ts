export interface JobDescriptionDetails {
    "departmentId": "number",
    "practiceId": "number",
    "templateName": "string",
    "details": {
        "companyOverview": "string",
        "practiceOverview": "string",
        "jobDesc": "string",
        "responsibilities": "string",
        "skills": {
            "uxDesignSkills": Array<string>,
            "technicalSkills": Array<string>,
            "certifications": Array<string>,
            "others": "string"
        },
        "education": "string",
        "screeningQuestions": "string"
    },
    "deprecated": "boolean"
}