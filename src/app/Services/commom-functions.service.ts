import { Injectable } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CommomFunctionsService {
  constructor() {}

  // Only numbers
  numOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
  numAndDashOnly(event: any) {
    const charCode = event.which || event.keyCode;
    
    // Allow numeric characters (0-9) and the dash character ("-")
    if ((charCode >= 48 && charCode <= 57) || charCode === 45) {
      return true;
    }
    
    return false;
  }

  //// Email Pattern
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //// Name Pattern
  namepatt = /[a-zA-Z][a-zA-Z ]+/;

  //// Mobile Number Pattern
  mobpattern = /^[6-9]\d{9}$/;

    //// Mobile Number Pattern
    upiid = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+$/;


  //// Pincode Pattern
  // pinpatt = /^-?(0|[1-9]\d*)?$/;
  pinpatt = /([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})/;

  //// Only Number Pattern
  onlynumber = /^[0-9]*$/;

  ////  Date Format 09/12/2023
  dateFormat = 'dd/MM/yyyy';

  ////  Date Format 09/DEC/2023
  dateFormatMMM = 'dd/MMM/yyyy';

  ////  Month Format DEC
  onlyMonthFormatMMM = 'MMM';

  ////  Month Format 12
  onlyMonthFormatMM = 'MM';

  ////  Date & Time Format 09/12/2023 06:22:10
  dateMMTimeSecFormat = 'dd/MM/yyyy HH:mm:ss';

  ////  Date & Time Format 09/DEC/2023 06:22:10
  dateMMMTimeSecFormat = 'dd/MMM/yyyy HH:mm:ss';

  ////  Date & Time Format 09/12/2023 06:22
  dateMMTimeFormat = 'dd/MM/yyyy HH:mm';

  ////  Date & Time Format 09/DEC/2023 06:22
  dateMMMTimeFormat = 'dd/MMM/yyyy HH:mm';

  ////  Time Format 06:22:10
  timeFormatSec = 'HH:mm:ss';

  ////  Time Format 06:22
  timeFormat = 'HH:mm';

  //// Account Number Pattern
  Accountpatt = /^\d{9,18}$/;

  //// IFSC Code Pattern
  IFSCpatt = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  //// Pincode Pattern
  PincodePatt = /^[1-9][0-9]{5}$/;

  //// GST Pattern
  GSTpattern: RegExp =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  //// Pan Card Number Pattern
  PanPattern: RegExp = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ///Allow only characters
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  ///// Allow only number and character
  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }

  ///// Allow only number and character
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  /////Only Number & One Dot

  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }

  /////Only Number & Dot

  // onlynumdot(event: any) {
  //   event = event ? event : window.event;
  //   var charCode = event.which ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 46 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  //allow number with -
  omitwithminus(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode !== 45 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Number with decimal format
  numberWithDecimal(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      charCode === 46 && // Decimal point character code
      event.target.value.includes('.')
    ) {
      return false;
    } else if (
      charCode !== 46 && // Decimal point character code
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }

    return true;
  }

  //  Number with decimal & Minus (-) format
  numberWithDecimalWithMinus(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;

    if (
      (charCode === 46 && inputValue.includes('.')) ||
      (charCode === 45 && inputValue.includes('-'))
    ) {
      return false;
    }

    if (
      charCode !== 46 && // Decimal point character code
      charCode !== 45 && // Minus sign character code
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
  }

  //////////Disable After Dates
  disabledAfterDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  //////////Disable Before Dates
  disabledBeforeDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  disabledBeforeDatebefore = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

    year:RegExp =/\b\d{4}-\b/
    
}
