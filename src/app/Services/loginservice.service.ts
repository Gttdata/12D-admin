import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { UserMaster } from 'src/app/Models/usermaster';
import { Observable } from 'rxjs';
import { appkeys } from '../app.constant';
@Injectable({
  providedIn: 'root',
})
export class LoginserviceService {
  // cloudID
  // ORGANIZATION_ID=this.cookie.get('ORGANIZATION_ID')
  Baseurl = appkeys.baseUrl;
  // url = appkeys.url;
  clientId = 1;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  loggerUrl = appkeys.gmUrl;
  //Local
  apikey='PiuRcts9gYsh8CMwAIwApvNL4PayKIaR'
  applicationkey='0vGdJAP307JqaNYP'

  //Testing
  // apikey='Hw28hh3Sl8iDL4HpBnq1dzozaGsu9nWh'
  // applicationkey='ewr9DpnLLqMOp9D3'
  constructor(
    public httpClient: HttpClient,
    public cookie: CookieService,
    private message: NzNotificationService
  ) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = Math.floor(100000 + Math.random() * 900000);

      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '',
        '',
        false,
        'Strict'
      );
      //localStorage.setItem("deviceId",deviceId.toString())
    }

    this.httpHeaders = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // applicationkey: '0vGdJAP307JqaNYP',
      // apikey: 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR',
      //Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      visitorid: this.cookie.get('visitorId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  logoutForSessionValues() {
    this.cookie.deleteAll();
    this.cookie.delete('supportKey');
    this.cookie.delete('token');
    sessionStorage.clear();
    // window.location.reload()
  }

  //get all any For login menu
  getForms(roleId: number) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // apikey: 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR',
      // applicationkey: '0vGdJAP307JqaNYP',
      // Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'api/user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getCheckAccessOfForm(roleId: number, link: string) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // apikey: 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR',
      // applicationkey: '0vGdJAP307JqaNYP',
      // Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      ROLE_ID: roleId,
      LINK: link,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'roleDetails/checkAccess',
      JSON.stringify(data),
      this.options
    );
  }

  login(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // apikey: 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR',
      // applicationkey: '0vGdJAP307JqaNYP',
      // Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post<any[]>(
      this.Baseurl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }

  loginasteacher(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // apikey: 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR',
      // applicationkey: '0vGdJAP307JqaNYP',
      // Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post<any[]>(
      this.Baseurl + 'appUser/loginTeacher',
      JSON.stringify(data),
      this.options
    );
  }
  requestPermission(userId: string) {
    // this.angularFireMessaging.requestToken.subscribe(
    //   (token) => {
    //
    //     this.cloudID=token
    //
    //    //this.updateToken(userId, token);
    //   },
    //   (err) => {
    //   }
    // );
  }

  httpHeaders1 = new HttpHeaders({
    Accept: 'application/json',
    apikey: '9876543210',
    Token: this.cookie.get('token'),
  });
  options1 = {
    headers: this.httpHeaders1,
  };

  loggerInit() {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      //local
      // apikey: 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
      // applicationkey: '0vGdJAP307JqaNYP',

      // Testing
      apikey: this.apikey,
      applicationkey: this.applicationkey,
      deviceid: this.cookie.get('deviceId'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      CLIENT_ID: this.clientId,
    };
    return this.httpClient.post<any>(
      this.loggerUrl + 'device/init',
      JSON.stringify(data),
      this.options
    );
  }

  getAllForms(
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
      this.Baseurl + 'api/form/get',
      JSON.stringify(data),
      this.options
    );
  }

  createForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.Baseurl + 'api/form/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.Baseurl + 'api/form/update',
      JSON.stringify(form),
      this.options
    );
  }

  //methods for role related opearation  - ROLE
  getAllRoles(
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
      this.Baseurl + 'api/role/get',
      JSON.stringify(data),
      this.options
    );
  }

  createRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.Baseurl + 'api/role/create/',
      JSON.stringify(application),
      this.options
    );
  }

  updateRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.Baseurl + 'api/role/update/',
      JSON.stringify(application),
      this.options
    );
  }

  //get all form assigned - ROLE_DETAILS
  getRoleDetails(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    //
    return this.httpClient.post<any>(
      this.Baseurl + 'api/roleDetails/getData',
      JSON.stringify(data),
      this.options
    );
  }

  //assign all method forms - ROLE_DETAILS
  addRoleDetails(roleId: number, data1: string[]): Observable<any> {
    //
    var data = {
      ROLE_ID: roleId,
      data: data1,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'api/roleDetails/addBulk',
      data,
      this.options
    );
  }

  //method for user replated opearation - USER
  getAllUsers(
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
      this.Baseurl + 'api/user/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.post<any>(
      this.Baseurl + 'api/user/create/',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.put<any>(
      this.Baseurl + 'api/user/update/',
      JSON.stringify(user),
      this.options
    );
  }
  getAPKDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      // MONTH:MONTH,
      // YEAR:YEAR
    };
    return this.httpClient.post<[]>(
      this.Baseurl + "globalSettings/getVestionUpdatedHistory",
      JSON.stringify(data),
      this.options
    );
  }

  getAPKInfo(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<[]>(
      this.Baseurl + "globalSettings/getVersion",
      JSON.stringify(data),
      this.options
    );
  }
  checkOnlineStatus(): boolean {
    return navigator.onLine;
  }
  apkUrl = this.Baseurl + "upload/App/"
  onFileUploadWithProgress(
    folderName,
    selectedFile,
    filename
  ): Observable<HttpEvent<any>> {
    this.httpHeaders1 = new HttpHeaders({
      supportkey: this.cookie.get("supportKey"),
      apikey: "68h3u1OxG6We2UnRD4F3IratYZHQ5hRB",
      applicationkey: "AfIpESwBr5eHp7w3",
      Token: this.cookie.get("token"),
    });

    const fd = new FormData();
    fd.append("Apk", selectedFile, filename);
    let params = new HttpParams();

    const options = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest("POST", this.apkUrl, fd, options);
    return this.httpClient.request(req);
  }
  updateGlobalSettingInfo(apkInfo: any): Observable<any> {
    apkInfo.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.Baseurl + "globalSettings/updatedVersion/",
      JSON.stringify(apkInfo),
      this.options
    );
  }
}
