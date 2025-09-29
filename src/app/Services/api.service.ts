import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concat, Observable, of } from 'rxjs';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from '../app.constant';
import { Ticketgroup } from '../pages/Task Management/Models/Ticketgroup';
import {
  activityhead,
  activitymaster,
} from '../pages/Health & Fitness, Masters/Models/activityheadmaster';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  currentMessage = new BehaviorSubject(null);
  ORGANIZATION_ID = this.cookie.get('ORGANIZATION_ID');
  cloudID;
  clientId = 1;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  httpHeaders1 = new HttpHeaders();
  httpHeaders2 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  baseUrl = appkeys.baseUrl;
  gmUrl = 'http://gm.tecpool.in:8079/';
  // baseUrl = 'https://3554-2405-201-1011-1031-194-9ae2-aa62-8fde.ngrok-free.app/';
  // baseUrl: 'http://192.168.29.209:2000/';

  // baseUrl = 'http://trackk.uvtechsoft.com:9889/';
  url = this.baseUrl + 'api/';
  //loggerUrl =  this.baseUrl + "logger/";
  imgUrl = this.baseUrl + 'upload/';
  retriveimgUrl = this.baseUrl + 'static/';
  applicationId = 1;

  moduleId = Number(this.cookie.get('moduleId'));
  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  //Local
  apikey = 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR';
  applicationkey = '0vGdJAP307JqaNYP';

  //Testing
  // apikey='Hw28hh3Sl8iDL4HpBnq1dzozaGsu9nWh'
  // applicationkey='ewr9DpnLLqMOp9D3'
  constructor(
    private cookie: CookieService,
    private message: NzNotificationService,
    private httpClient: HttpClient
  ) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = this.randomstring(16);
      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '',
        '',
        false,
        'Strict'
      );
    }

    // Testing

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Hw28hh3Sl8iDL4HpBnq1dzozaGsu9nWh',
    //   applicationkey: 'ewr9DpnLLqMOp9D3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // console.log(this.httpHeaders)

    // Local

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };
  }

  randomstring(L) {
    var s = '';
    var randomchar = function () {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };

    while (s.length < L) s += randomchar();
    return s;
  }

  subscribeTokenToTopic(token, topic) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `key= AAAAVM2R_rI:APA91bGOluvSPCVNouGePNI0KxG1XhF09u69xB5s9tnqhFddvCLGZcMqoEnQrmSMM-CXUfLh2uZZPB0JGeDiavayd4oSl3ADw_Ft6iS0jGqBkysT3_upWREyEGphtaTEhyqtL3Obubfh`,
    });

    var options22 = {
      headers: this.httpHeaders,
    };

    let httpReqs = topic.map((i) =>
      this.httpClient
        .post(
          `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${i}`,
          {},
          options22
        )
        .pipe(catchError((err) => of({ err })))
    );
    concat(...httpReqs).subscribe((data) => {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    });
    return true;
  }

  unsubscribeTokenToTopic(token) {
    var d = this.cookie.get('channels');
    var channels = d.split(',');
    var bodyArray = [];
    for (var i = 0; i < channels.length; i++) {
      if (channels[i] != null && channels[i].trim() != '') {
        var b = {
          to: '/topics/' + channels[i],
          registration_tokens: [token],
        };
        bodyArray.push(b);
      }

      if (i == channels.length - 1) {
        this.httpHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `key= AAAAVM2R_rI:APA91bGOluvSPCVNouGePNI0KxG1XhF09u69xB5s9tnqhFddvCLGZcMqoEnQrmSMM-CXUfLh2uZZPB0JGeDiavayd4oSl3ADw_Ft6iS0jGqBkysT3_upWREyEGphtaTEhyqtL3Obubfh`,
        });
        var options22 = {
          headers: this.httpHeaders,
        };
        let httpReqs = bodyArray.map((i) =>
          this.httpClient
            .post(`https://iid.googleapis.com/iid/v1:batchRemove`, i, options22)
            .pipe(catchError((err) => of({ err })))
        );
        concat(...httpReqs).subscribe((data) => {
          this.cookie.deleteAll();
          sessionStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        });
      }
    }
    return true;
  }

  getQuotationSummary(FROM_DATE: any, TO_DATE: any, filter): Observable<[]> {
    var data = { FROM_DATE: FROM_DATE, TO_DATE: TO_DATE, filter: filter };
    return this.httpClient.post<[]>(
      this.url + 'quatation/getDashboardQuotationSummaryByUser',
      JSON.stringify(data),
      this.options
    );
  }

  getAlldashboard_Counts(ID): Observable<any> {
    var data = { ID: ID };
    return this.httpClient.post<any>(
      this.url + 'dashboardCounts/get',
      JSON.stringify(data),
      this.options
    );
  }

  getEnquiryCount(): Observable<[]> {
    var data = {};
    return this.httpClient.post<[]>(
      this.url + 'enquiry/getDashboardEnquirySummary',
      JSON.stringify(data),
      this.options
    );
  }

  getQuotationCount(): Observable<[]> {
    var data = {};
    return this.httpClient.post<[]>(
      this.url + 'quatation/getDashboardQuotationSummary',
      JSON.stringify(data),
      this.options
    );
  }

  getEnquirySummary(): Observable<[]> {
    var data = {};
    return this.httpClient.post<[]>(
      this.url + 'enquiry/getDashboardEnquirySummaryByUser',
      JSON.stringify(data),
      this.options
    );
  }

  // Masters

  // Country Master

  getALLCountry(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'country/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateCountry(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'country/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateCountry(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'country/update',
      JSON.stringify(data),
      this.options
    );
  }

  // State Master

  getAllStateMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  createStateMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateStateMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  // District Master

  getAllDistrict(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'district/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateDistrict(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'district/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateDistrict(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'district/update',
      JSON.stringify(data),
      this.options
    );
  }
  // City Master

  getAllCityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateCity(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateCity(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Teacher Master

  getALLTeacher(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateTeacher(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/addTeacher',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateTeacher(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'appUser/update',
      JSON.stringify(data),
      this.options
    );
  }
  TeacherAprroveReject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/approveRejectTeacher',
      JSON.stringify(data),
      this.options
    );
  }

  getTeacherCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/getTeacherCount',
      JSON.stringify(data),
      this.options
    );
  }

  // Year Master

  getAllYearMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'year/get',
      JSON.stringify(data),
      this.options
    );
  }

  createYear(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'year/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateYear(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'year/update',
      JSON.stringify(data),
      this.options
    );
  }

  getAllDivisions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'createDivision/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDivision(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'createDivision/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateDivision(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'createDivision/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Board Master

  getAllBoardMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'board/get',
      JSON.stringify(data),
      this.options
    );
  }

  createBoard(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'board/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateBoard(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'board/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Medium Master

  getAllMediumMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'medium/get',
      JSON.stringify(data),
      this.options
    );
  }

  createMedium(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'medium/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateMedium(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'medium/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Question Paper Class List Master

  getAllQuestionPaperClassMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionPaperClass/get',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestionPaperClass(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'questionPaperClass/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuestionPaperClass(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'questionPaperClass/update',
      JSON.stringify(data),
      this.options
    );
  }

  // School Master

  getAllSchool(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'school/get',
      JSON.stringify(data),
      this.options
    );
  }

  createSchool(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'school/add',
      JSON.stringify(data),
      this.options
    );
  }

  updateSchool(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'school/updateSchool',
      JSON.stringify(data),
      this.options
    );
  }

  BasicupdateSchool(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'school/updateStep',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSchoolStatus(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'school/approveReject',
      JSON.stringify(data),
      this.options
    );
  }

  schoolAprroveReject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'school/approveReject',
      JSON.stringify(data),
      this.options
    );
  }
  // Year Master

  getALLTaskType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      // this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateTaskType(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateTaskType(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      // this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Task Master

  getALLTask(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'classWiseTask/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'classWiseTask/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'classWiseTask/update',
      JSON.stringify(data),
      this.options
    );
  }

  assignTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'classWiseTask/assignTask',
      JSON.stringify(data),
      this.options
    );
  }

  // AdvertiseMent Master

  getALLAdvertisement(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'advertisement/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAdvertise(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'advertisement/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateAdvertise(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'advertisement/update',
      JSON.stringify(data),
      this.options
    );
  }

  // AdvertiseMent Master

  getAgeCateogary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ageGroup/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateAge(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ageGroup/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateAge(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ageGroup/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Subscription Master

  getSuscription(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'subscription/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateSubscription(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'subscription/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSubscription(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'subscription/update',
      JSON.stringify(data),
      this.options
    );
  }

  // All students

  // Class Master

  getAllClasses(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'createclass/get',
      JSON.stringify(data),
      this.options
    );
  }

  // Division Master

  // Social Task Master

  getSocialTask(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      // this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateSocialTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSocialTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      // this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Task Master

  getALLTaskMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      // this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateAllTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateAllTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      // this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Social Task Mapping Master

  getSocialTaskMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      // this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateSocialTaskMapping(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSocialTaskMapping(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      // this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  onuploadheader() {
    // ////// For Local /////
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
    });
    // this.options1 = {
    //   headers: this.httpHeaders,
    // };
    // //////  Testing  /////
    // this.httpHeaders1 = new HttpHeaders({
    //   Accept: 'application/json',
    //   apikey: 'Hw28hh3Sl8iDL4HpBnq1dzozaGsu9nWh',
    //   applicationkey: 'ewr9DpnLLqMOp9D3',
    //   Token: this.cookie.get('token'),
    //   supportkey: this.cookie.get('supportKey'),
    // });
    this.options1 = {
      headers: this.httpHeaders,
    };
  }

  onUpload(folderName, selectedFile, filename): Observable<any> {
    this.onuploadheader();

    let params = new HttpParams();
    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    const req = new HttpRequest('POST', this.imgUrl + folderName, fd, options1);
    return this.httpClient.request(req);
  }

  deletePdf(FILE_URL: any): Observable<number> {
    // form.CLIENT_ID = this.clientId;
    var data = {
      FILE_URL: FILE_URL,
    };

    return this.httpClient.post<number>(
      this.baseUrl + 'web/removeFile',
      JSON.stringify(data),
      this.options
    );
  }

  // All students

  getAllstudents(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/get',
      // this.url + 'studentClassMapping/get',

      JSON.stringify(data),
      this.options
    );
  }
  createStudent(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/createStudents',
      JSON.stringify(data),
      this.options
    );
  }

  updateStudent(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'appUser/update',
      JSON.stringify(data),
      this.options
    );
  }
  // <Class Master> //

  getstudentFeeDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'studentFeeDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  mapstudentFeeDetails(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'studentFeeDetails/addBulk',
      this.url + 'studentFee/addBulk',

      JSON.stringify(data),
      this.options
    );
  }
  sendNotification2(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'studentFeeDetails/addBulk',
      this.url + 'studentFee/sendFeeDuesNotification',

      JSON.stringify(data),
      this.options
    );
  }
  getAllClassMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'createClass/get',
      JSON.stringify(data),
      this.options
    );
  }

  createClass(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'createClass/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateClass(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'createClass/update',
      JSON.stringify(data),
      this.options
    );
  }

  ClassTeacherMap(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'subjectTeacherMapping/mapBulkSubject',
      JSON.stringify(data),
      this.options
    );
  }

  // < Student Fee Details  > //
  getStudentFessDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'studentFeeDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateStudentFeeDetails(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'studentFeeDetails/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateStudentFeeDetails(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'studentFeeDetails/update',
      JSON.stringify(data),
      this.options
    );
  }

  // < Holiday Master> //
  getAllHolidaysMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'holiday/get',
      JSON.stringify(data),
      this.options
    );
  }

  createHolidayMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'holiday/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateHolidayMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'holiday/update',
      JSON.stringify(data),
      this.options
    );
  }

  ExcelonUpload(folderName, selectedFile, filename): Observable<any> {
    this.onuploadheader();

    let params = new HttpParams();
    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    // const req = new HttpRequest('POST', this.imgUrl + folderName, fd, options1);
    // return this.httpClient.request(req);
    return this.httpClient.post<any>(
      this.baseUrl + 'upload/' + folderName,
      fd,
      options1
    );
  }
  studentAprroveReject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/approveRejectStudent',
      JSON.stringify(data),
      this.options
    );
  }

  getStudentsCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/getStudentCount',
      JSON.stringify(data),
      this.options
    );
  }
  importStudent(
    FILE_URL: any,
    CLASS: any,
    YEAR: any,
    SCHOOL_ID: any,
    DIVISION_ID: any,
    MEDIUM_ID: any
  ): Observable<number> {
    // form.CLIENT_ID = this.clientId;
    var data = {
      EXCEL_FILE_NAME: FILE_URL,
      CLASS_ID: CLASS,
      YEAR_ID: YEAR,
      SCHOOL_ID: SCHOOL_ID,
      DIVISION_ID: DIVISION_ID,
      MEDIUM_ID: MEDIUM_ID,
    };

    return this.httpClient.post<number>(
      this.url + 'appUser/importStudents',
      JSON.stringify(data),
      this.options
    );
  }

  MapClass(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/mapClassStudent',
      JSON.stringify(data),
      this.options
    );
  }

  getallMappedClass(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'studentClassMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  PromoteData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/promoteStudents',
      JSON.stringify(data),
      this.options
    );
  }

  // Subject Master

  getAllSubjectMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'subject/get',
      JSON.stringify(data),
      this.options
    );
  }

  // Subject Master

  getALLClassTeacherMappingMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'classTeacherMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createSubjectMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      // this.url + 'subject/create',
      this.url + 'subject/add',

      JSON.stringify(data),
      this.options
    );
  }
  mapSubject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'subject/map',
      JSON.stringify(data),
      this.options
    );
  }
  updateSubjectMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'subject/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Chapter Master

  getAllChapterMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'chapter/get',
      JSON.stringify(data),
      this.options
    );
  }

  createChapterMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'chapter/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateChapterMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'chapter/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Question Type //

  getAllQuestionType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionType/get',
      JSON.stringify(data),
      this.options
    );
  }
  createQuestionType(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'questionType/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuestionType(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'questionType/update',
      JSON.stringify(data),
      this.options
    );
  }
  // <Get All Student Task> //

  getAllstudentsTask(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'studentTaskDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  createStudentTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'studentTaskDetails/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateStudentTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'studentTaskDetails/update',
      JSON.stringify(data),
      this.options
    );
  }

  getAllQuestionMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'question/get',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestionMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'question/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuestionMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'question/update',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestionMasterBulk(data1: any): Observable<any> {
    var data = {
      QUESTION_DATA: [data1],
    };

    return this.httpClient.post<any>(
      this.url + 'question/addBulk',
      JSON.stringify(data),
      this.options
    );
  }

  // assessmentQuestionsImporter(data1: any): Observable<number> {
  //   var data = {
  //     QUESTION_DATA: data1
  //   };
  //   return this.httpClient.post<number>(this.url + "question/addBulk", data, this.options);
  // }
  updateQuestionMasterBulk(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'question/updateBulk',
      JSON.stringify(data),
      this.options
    );
  }

  getAllMappedQuestion(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionOptionsMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'school/getCount',
      JSON.stringify(data),
      this.options
    );
  }
  getHeadData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'feeHead/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateHead(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'feeHead/update',
      JSON.stringify(data),
      this.options
    );
  }

  createHead(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'feeHead/create',
      JSON.stringify(data),
      this.options
    );
  }
  getclassFeeMappingData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'classFeeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getSubjectTeacherMappingData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'subjectTeacherMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  mapClassBulk(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'classFeeMapping/add',
      JSON.stringify(data),
      this.options
    );
  }

  getAllQuestionSubject(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionSubject/get',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestionSubject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'questionSubject/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuestionSubject(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'questionSubject/update',
      JSON.stringify(data),
      this.options
    );
  }

  assessmentQuestionsImporter(data1: any): Observable<number> {
    var data = {
      QUESTION_DATA: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'question/addBulk',
      data,
      this.options
    );
  }

  //Board Medium Master//

  getAllBoardMediumMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'boardMedium/get',
      JSON.stringify(data),
      this.options
    );
  }

  createBoardMedium(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'boardMedium/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateBoardMedium(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'boardMedium/update',
      JSON.stringify(data),
      this.options
    );
  }

  //Fee Details Master//

  getAlFeeDetailsMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'studentFee/get',
      JSON.stringify(data),
      this.options
    );
  }

  //Counts For Dashboard
  getDashboardCounts(SCHOOL_ID: number, YEAR_ID: any): Observable<any> {
    var data = {
      SCHOOL_ID: SCHOOL_ID,
      YEAR_ID: YEAR_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/getAllCount',
      JSON.stringify(data),
      this.options
    );
  }
  getClassWiseAttendanceReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'attendanceReport/getClasswiseCount',
      JSON.stringify(data),
      this.options
    );
  }
  getClassWisetaskReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/taskStatus',
      JSON.stringify(data),
      this.options
    );
  }
  getClassWisetaskReport2(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'classwiseTask/getData',
      JSON.stringify(data),
      this.options
    );
  }
  getClassWiseFeeSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/classWiseFeeCount',
      JSON.stringify(data),
      this.options
    );
  }

  getSchoolWiseMemberSummery(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'schoolReports/schoolWiseMemberCount',
      JSON.stringify(data),
      this.options
    );
  }

  getAllUserSubscription(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userSubscription/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUserSubscription(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'userSubscription/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateUserSubscription(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'userSubscription/update',
      JSON.stringify(data),
      this.options
    );
  }
  getAllTicketGroups(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Ticketgroup[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Ticketgroup[]>(
      this.url + 'ticketGroup/get',
      JSON.stringify(data),
      this.options
    );
  }

  // getAllFaqHeads(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any[]> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter
  //   };

  //   return this.httpClient.post<any[]>(this.url + "faqHead/get", JSON.stringify(data), this.options);
  // }

  // getAllDepartments(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any[]> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter
  //   };

  //   return this.httpClient.post<any>(this.url + "department/get", JSON.stringify(data), this.options);
  // }

  updateTicketGroup(ticketGroup: Ticketgroup): Observable<number> {
    ticketGroup.IS_LAST = ticketGroup.IS_LAST ? 1 : 0;
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + 'ticketGroup/update/',
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  createTicketGroup(ticketGroup: Ticketgroup): Observable<number> {
    ticketGroup.IS_LAST = ticketGroup.IS_LAST ? 1 : 0;
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + 'ticketGroup/create/',
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  getAttendanceDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'attendanceDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  // Health And Fitness
  getActivityHeadMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<activityhead[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any[]>(
      this.url + 'activityHead/get',
      JSON.stringify(data),
      this.options
    );
  }
  createActivityHeadMaster(data: activityhead) {
    data['CLIENT_ID'] = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'activityHead/create',
      JSON.stringify(data),
      this.options
    );
  }
  updateActivityHeadMaster(data: activityhead) {
    data['CLIENT_ID '] = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'activityHead/update',
      JSON.stringify(data),
      this.options
    );
  }
  getActivityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<activitymaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<activitymaster[]>(
      this.url + 'activity/get',
      // this.url + 'activityHeadMapping/get',

      JSON.stringify(data),
      this.options
    );
  }
  createActivityMaster(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'activity/create',
      JSON.stringify(data),
      this.options
    );
  }
  updateActivityMaster(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'activity/update',
      // this.url + 'activityHead/update',

      JSON.stringify(data),
      this.options
    );
  }
  getActivityCategoryMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<activitymaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<activitymaster[]>(
      // this.url + 'activity/get',
      this.url + 'activityCategory/get',

      JSON.stringify(data),
      this.options
    );
  }
  createActivityCategoryMaster(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'activityCategory/create',
      JSON.stringify(data),
      this.options
    );
  }
  updateActivityCategoryMaster(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'activityCategory/update',
      // this.url + 'activityHead/update',

      JSON.stringify(data),
      this.options
    );
  }

  getAllactivitysubcateogary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activitySubCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createActivitySubCateogary(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'activitySubCategory/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateActivitySubCateogary(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'activitySubCategory/update',
      JSON.stringify(data),
      this.options
    );
  }
  // Activity Head Mapping
  getAllactivityheadmapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityHeadMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createActivityheadMapping(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'activityHeadMapping/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateActivityheadMapping(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'activityHeadMapping/update',
      JSON.stringify(data),
      this.options
    );
  }
  // Class Wise Home Work Report
  getClasswiseHomwerk(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<activitymaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<activitymaster[]>(
      this.url + 'schoolReports/studentWiseTaskDetails',
      JSON.stringify(data),
      this.options
    );
  }
  //School wise Task Creation Report
  getSchoolWiseTaskCreationReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<activitymaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<activitymaster[]>(
      this.url + 'schoolReports/schoolWiseTaskCount',
      JSON.stringify(data),
      this.options
    );
  }

  // TrackBook Module

  // Trackbook

  getAllTrackBookTasks(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'task/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTrackbookTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'task/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateTrackbookTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'task/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Dimension Master
  getAllDimensionMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'diamentions/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDimension(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'diamentions/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateDimension(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'diamentions/update',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestionMasterTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'questionary/add',
      JSON.stringify(data),
      this.options
    );
  }
  optionsAddonEdit(data: any): Observable<any> {
    data['CLIENT_ID'] = this.clientId;
    // var data1={
    //   CLIENT_ID=this.clientId
    // }
    // console.log(data);

    return this.httpClient.post<any>(
      this.url + 'questionaryOptions/add',
      JSON.stringify(data),
      this.options
    );
  }
  updateQuestionMasterTask(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'questionary/update',
      JSON.stringify(data),
      this.options
    );
  }
  //Delete Data
  deleteFeeHeadData(FeeHeadRecord: any = []): Observable<any> {
    var data = {
      FeeHeadRecprd: FeeHeadRecord,
    };
    console.log(data);

    return this.httpClient.post<any>(
      this.url + 'reports/deleteTransactions',
      JSON.stringify(data),
      this.options
    );
  }

  getAllQuestionnariesData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllOptionsData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionaryOptions/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllOptionsmapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'optionTaskMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  UpdateOptionsmapping(data): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'optionTaskMapping/update',
      JSON.stringify(data),
      this.options
    );
  }
  deleteOptiondata(data) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'questionaryOptions/update',
      JSON.stringify(data),
      this.options
    );
  }
  //Coupon Master
  getAllCoupon(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'coupon/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCoupon(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'coupon/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCoupon(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'coupon/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Animation Master

  getALLAnimation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'animation/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAnimation(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'animation/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateAnimation(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'animation/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Animation Details

  getALLAnimationDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'animationDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAnimationDetails(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'animationDetails/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateAnimationDetails(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'animationDetails/update',
      JSON.stringify(data),
      this.options
    );
  }

  // Animation Rewards

  getALLAnimationRewards(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'animationRewards/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAnimationRewards(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'animationRewards/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateAnimationRewards(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'animationRewards/update',
      JSON.stringify(data),
      this.options
    );
  }
  // url2 = this.baseUrl + 'api/';

  updateAppConfiguration(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'globalSettings/updatedVersion',
      JSON.stringify(data),
      this.options
    );
  }

  // Reports Regular
  getUsersReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/get',
      JSON.stringify(data),
      this.options
    );
  }
  getSubscriptionReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userSubscription/get',
      JSON.stringify(data),
      this.options
    );
  }
  getSubscriptionSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userSubscription/getUserSubscriptionSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getCouponCodeSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'couponUsage/getCoupanUsageSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getCouponCodeDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'couponUsage/get',
      JSON.stringify(data),
      this.options
    );
  }
  getWhatsappMessageReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'whatsAppMessageHistory/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUserWiseNotificationReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'notification/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUserWiseMailReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'emailMessageHistory/get',
      JSON.stringify(data),
      this.options
    );
  }
  getWhatsappOtpReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'whatsAppMessageHistory/get',
      JSON.stringify(data),
      this.options
    );
  }
  getCustomCreatedwokoutReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityHead/getCustomWorkOutReports',
      JSON.stringify(data),
      this.options
    );
  }
  getCustomCreatedsummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityHead/getCustomWorkOutSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getActivityUsesReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityUserMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUsersBmiReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userBmi/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUsersQuestionAndAnswerReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userQuestionaries/get',
      JSON.stringify(data),
      this.options
    );
  }
  getTaskCompletionSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userTrackbook/getTaskCompletionSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getuserWiseTaskCompletionSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userTrackbook/getUserTaskCompletionSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getuserWiseTaskCompletionDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userTrackbook/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAnimationSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'animation/getAnimationSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getUserWiseAnimationDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userAnimationDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUserWiseRewardDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userRewards/get',
      JSON.stringify(data),
      this.options
    );
  }
  getUserWiseAnimationCompletionReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'animation/getUserAnimationCompletion',
      JSON.stringify(data),
      this.options
    );
  }
  getPeriodReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'periodTracking/get',
      JSON.stringify(data),
      this.options
    );
  }
  getPreActivitySummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityUser/getPreArrengeActivity',
      JSON.stringify(data),
      this.options
    );
  }
  getPreActivitydetailed(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityUser/get',
      JSON.stringify(data),
      this.options
    );
  }
  getTracbooktaskSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'userTrackbook/getSummary',
      JSON.stringify(data),
      this.options
    );
  }
  getContactUsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'contactUs/get',
      JSON.stringify(data),
      this.options
    );
  }
  // Animation Master

  getAllBanners(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'banner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createBanner(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'banner/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateBanner(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'banner/update',
      JSON.stringify(data),
      this.options
    );
  }
  studentFeeDelete(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'studentFee/delete',
      JSON.stringify(data),
      this.options
    );
  }
}
