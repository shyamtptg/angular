import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
var CryptoJS = require("crypto-js");
@Injectable()
export class CommonService {
    private enabledFeatures: any;
    private clientPhrase: string = 'inno space 321';
    hrSignature = "Pallavi Garimella \nDirector - Human Resources";
    officeAddress = "Innominds Software SEZ India Pvt Ltd.,\nSurvey No.115 (Part), Waverock, \nTSIIC IT / ITES SEZ, Nanakramguda Village, \nSerilingampally Mandal, Hyderabad – 500008 \nPhone: +91-40-46126300 \nIndia";
    constructor(private router: Router) { };
    ngOnInit() {
        this.getfeatures();
    }
    getfeatures() {
        var userDetails: any = this.getItem('currentUserInfo');
        if (userDetails) {
            this.enabledFeatures = userDetails.enabledFeatures;
        } else {
            this.router.navigate(['/login'])
        }
    }
    hideFeature(feature: string) {
        this.getfeatures();
        if (this.enabledFeatures) {
            return (this.enabledFeatures.indexOf(feature) == -1) ? true : false;
        }
    }
    downloadCsv(ReportTitle: string, CSV: any) {
        var fileName = ReportTitle.replace(/ /g, "_");
        var uri = 'data:text/csv;charset=utf-8,' + CSV;
        var link: any = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    formatAMPM(date: any) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    convertNumberToWords(amount: any) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        var amountStr = amount.toString();
        var atemp = amountStr.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++ , j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        var k = n_array[j].toString();
                        n_array[j] = 10 + parseInt(k);
                        n_array[i] = 0;
                    }
                }
            }
            var value = 0;
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string;
    }
    restrictCharcters(value: any) {
        if (value && value.toString().length > 8) {
            return false;
        } else {
            return true;
        }
    }
    restrictExpCharcters(value: any) {
        if (value && value.toString().indexOf('.') !== -1 && value.toString().indexOf('.') < 3) {
            if (value.toString().length > 3) {
                return false;
            } else {
                return true;
            }
        }
        else if (value && value.toString().length > 2) {
            return false
        }
        else {
            return true;
        }
    }
    validateCommentsLength(comments: any) {
        return (comments && comments.length > 1024) ? false : true;
    }
    restrictFloatnumber = function (e: any) {
        var input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d.\s]/.test(input);
    }
    restrictNumeric = function (e: any) {
        var input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }
    validateExperience = function (value: any) {
        if (value == 100) {
            return true;
        }
        return (value) ? /^\d{0,2}(\.\d{0,1})?$/.test(value) : true;
    }
    validateDecimalPlacesForExp = function (value: any) {
        if (value == 100) {
            return true;
        }
        return (value) ? /^\d{0,2}(\.\d{0,2})?$/.test(value) : true;
    }
    restrictLetters = function (e: any) {
        var input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[a-zA-Z]/.test(input);
    }
    restrictMobilenumber = function (e: any) {
        var input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s()+-]/.test(input);
    }
    IsJsonString = function (str: any) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    isPracticeAvailable = function (practices: any, practiceId: any) {
        if (practiceId && practices && practices.length > 0) {
            for (var index = 0; index < practices.length; index++) {
                if (practices[index]['id'] == practiceId) {
                    return true;
                }
            }
        }
        return false;
    }
    setItem = function (key: any, data: any) {
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), this.clientPhrase);
        localStorage.setItem(key, ciphertext);
    }
    getItem = function (key: any) {
        var ciphertext = localStorage.getItem(key);
        if (ciphertext) {
            try {
                var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), this.clientPhrase);
                var data = bytes.toString(CryptoJS.enc.Utf8);
                var decryptedData = data && JSON.parse(data);
                return ((decryptedData) ? decryptedData : null);
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    };
    /**
     * This method validates file formats, maximum file size and filename length for different file types.
     * @param {any} file - The file which is selected for uploading.
     * @param {string} fileType - The file type. e.g. resume.
     * @param {number} validFileSize - The maximium valid file size in bytes. e.g. 2097152 for size of 2 MB.
     * @param {number} validFileNameLength - The maximum valid file name length including extension. e.g. 69 for length of 69 characters.
     * @param {any} validFileFormats - The valid file formats array. e.g. ['docx', 'pdf', 'rtf'].
     */
    validateFile = function (file: any, fileType: string, validFileSize: number, validFileNameLength: number, validFileFormats: any) {
        var fileName = (file && file.name),
            fileSize = (file && file.size),
            fileExt = ((/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined);
        if (fileName && fileName.length > validFileNameLength) {
            throw new Error('Maximum length of the file name including extension should not exceed ' + validFileNameLength + ' characters.');
        } else if (fileExt == null || fileExt == undefined) {
            throw new Error('file name should have a valid extension');
        } else if (fileSize == 0) {
            throw new Error('The file should not be empty, file size should be greater than zero.');
        } else if (fileSize > validFileSize) {
            throw new Error('file size should not be greater than ' + (validFileSize / 1048576).toFixed(0) + ' MB.');
        } if (fileExt && validFileFormats) {
            var count = 0;
            $.each(validFileFormats, function (indx: any, value: any) {
                if (fileExt && ((fileExt[0].toLowerCase()) != value)) {
                    count++;
                }
            });
            if (count == validFileFormats.length) {
                throw new Error("The supported file types for " + fileType + " are " + this.joinArray(validFileFormats) + ". Please make sure your file is in supported types.");
            }
        }
        return true;
    }
    /**
     * This method formats the array by joining it in to comma seperated string.
     * @param {any} arr - The array to format.
     */
    joinArray = function (arr: any) {
        var outStr = "";
        if (arr.length === 1) {
            outStr = arr[0];
        } else if (arr.length === 2) {
            outStr = arr.join(' and ');
        } else if (arr.length > 2) {
            outStr = arr.slice(0, -1).join(', ') + ' and ' + arr.slice(-1);
        }
        return outStr;
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
    navigateToHiring() {
        this.getfeatures();
        if (this.enabledFeatures) {
            var redirect: any = (this.enabledFeatures && this.enabledFeatures.indexOf('VIEW_DASHBOARDS') == -1) ? '/hiring/hiring-requests/open-positions' : '/hiring/dashboard';
            this.router.navigate([redirect]);
        }
    }

    navigateToEmployeeOnboardingForms() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/onboarding/navigationBar';
            this.router.navigate([redirect]);
        }
    }
    navigateToLeaveManagement() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/leave-management/dashboard';
            this.router.navigate([redirect]);
        }
    }
    navigateToEmployeeOnboard() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/onboarding/dashboard';
            this.router.navigate([redirect]);
        }
    }

    navigateToWorkstations() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/workstations/dashboard';
            this.router.navigate([redirect]);
        }
    }
    navigateToManager() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/manager/managerinfo';
            this.router.navigate([redirect]);
        }

    }
    navigateToEmployeeId() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/employeeid/dashboard';
            this.router.navigate([redirect]);
        }
    }

    navigateToStepper() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/onboarding/navigationBar/basicInfo';
            this.router.navigate([redirect]);
        }
    }

    navigateToSuccess() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/onboarding/success';
            this.router.navigate([redirect]);
        }
    }

    navigateToAssets() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/assets/dashboard';
            this.router.navigate([redirect]);
        }
    }

    navigateToEmployeestatistics(data?: any) {
        this.getfeatures();
        if (this.enabledFeatures && data) {
            const redirect: any = '/onboarding/employeestatistics';
            this.router.navigate([redirect, data]);
        }
        if (this.enabledFeatures && !data) {
            const redirect: any = '/onboarding/employeestatistics';
            this.router.navigate([redirect]);
        }
    }

    navigateToHome() {
        this.getfeatures();
        if (this.enabledFeatures) {
            const redirect: any = '/home';
            this.router.navigate([redirect]);
        }
    }

    dateComparator(date1: any, date2: any) {
        const monthToComparableNumber = function (date: any) {
            if (date === undefined || date === null || date.length !== 10) {
                return null;
            }

            const yearNumber = date.substring(6, 10);
            const monthNumber = date.substring(3, 5);
            const dayNumber = date.substring(0, 2);

            const result = (yearNumber * 10000) + (monthNumber * 100) + dayNumber;
            return result;
        };
        const date1Number = monthToComparableNumber(date1);
        const date2Number = monthToComparableNumber(date2);

        if (date1Number === null && date2Number === null) {
            return 0;
        }
        if (date1Number === null) {
            return -1;
        }
        if (date2Number === null) {
            return 1;
        }

        return date1Number - date2Number;
    }
}


