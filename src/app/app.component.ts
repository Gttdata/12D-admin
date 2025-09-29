import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { UserMaster } from './Models/usermaster';
import { ApiService } from './Services/api.service';
import { LoginserviceService } from './Services/loginservice.service';
import { DatePipe } from '@angular/common';
import { SchoolMaster } from './pages/School Management/Models/SchoolMaster';
import { appkeys } from './app.constant';
import { CommomFunctionsService } from './Services/commom-functions.service';
import { HttpEventType } from '@angular/common/http';

export class APPConfiguration {
  DETOX_TIME: any;
  MIN_VERSION: any;
  DETOX_DURATION: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  data: APPConfiguration = new APPConfiguration();
  public commonFunction = new CommomFunctionsService();

  isVisible = false;
  isCollapsed = false;
  isSpinning = false;
  isLogedIn = false;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  screenwidth = 0;
  // isPassword = false;
  roleId = Number(sessionStorage.getItem('roleId'));
  menus = [];
  USERNAME = sessionStorage.getItem('userName');
  userId = sessionStorage.getItem('userId');
  TeacherDetails: any = sessionStorage.getItem('TeachersArray');
  ClassDetails: any = sessionStorage.getItem('ClassData');

  user = new UserMaster();
  showconfirm = false;
  currentroute = '';

  //Notification variables
  title = 'af-notification';
  messages: any = null;
  drawerVisible!: boolean;
  drawerTitle!: string;
  stateload: boolean;
  isFormListVisible: boolean;
  seperateMasters: any[] = [];
  // drawerData: Notification = new Notification();

  constructor(
    private router: Router,
    private api: LoginserviceService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private api2: ApiService,
    private datePipe:DatePipe
  ) {
    this.loggerInit();
    this.screenwidth = window.innerWidth;
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }

  checkpass() {
    if (
      this.PASSWORD == null ||
      this.PASSWORD == undefined ||
      this.PASSWORD == '' ||
      this.PASSWORD.trim() == ''
    ) {
      this.message.error('Please Enter Current Password', '');
    } else {
      this.api
        .getAllUsers(0, 0, 'ID', 'desc', ' AND ID=' + this.userId)
        .subscribe(
          (data) => {
            this.user = data['data'][0];
            if (this.PASSWORD == this.user.PASSWORD) {
              this.showconfirm = true;
            } else {
              this.showconfirm = false;
              this.message.error('Please enter correct password', '');
            }
          },
          (err) => {}
        );
    }
  }
  drawerClose2() {
    this.isFormListVisible = false;
  }
  colorarray = ['#71c8d5', '#6857575c'];
  confpass() {
    this.isSpinning = false;
    this.showconfirm = true;

    if (this.NEWPASSWORD.trim() == '' && this.CONFPASSWORD.trim() == '') {
      this.showconfirm = true;
      this.message.error('Please Enter All Fields', '');
    } else if (this.NEWPASSWORD == null || this.NEWPASSWORD.trim() == '') {
      this.showconfirm = true;
      this.message.error('Please Enter New Password', '');
    } else if (this.CONFPASSWORD == null || this.CONFPASSWORD.trim() == '') {
      this.showconfirm = true;
      this.message.error('Please Enter Confirm Password', '');
    } else if (this.NEWPASSWORD == this.CONFPASSWORD) {
      this.user.PASSWORD = this.NEWPASSWORD;
      this.api.updateUser(this.user).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Password Changed Successfully...', '');
          this.showconfirm = false;
          //if(!addNew)
          // this.drawerClose();
          this.isVisible = false;
          this.NEWPASSWORD = '';
          this.CONFPASSWORD = '';
          this.PASSWORD = '';
          this.isSpinning = false;
        } else {
          this.message.error('Password Change Failed...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.message.error(
        'Please enter new password & confirm password same',
        ''
      );
    }
  }

  loggerInit() {
    if (
      this.cookie.get('supportKey') === '' ||
      this.cookie.get('supportKey') === null
    ) {
      this.api.loggerInit().subscribe(
        (data) => {
          if (data.code == '200') {
            this.cookie.set(
              'supportKey',
              data['data'][0]['supportkey'],
              365,
              '',
              '',
              false,
              'Strict'
            );
          }
        },
        (err) => {}
      );
    } else {
    }
  }
  institutename = '';
  instiutelogo = '';
  imgUrl = appkeys.retriveimgUrl;
  institutelogourl = '';
  ngOnInit() {
    //Notification
    // this.requestPermission();
    // this.listen();

    if (this.roleId == 3) {
      this.ClassDataGet();
    }

    //
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null)
      this.isLogedIn = false;
    else {
      if (this.userId || this.roleId != 0) {
        this.isLogedIn = true;
        if (sessionStorage.getItem('schoolid')) {
          this.api2
            .getAllSchool(
              0,
              0,
              '',
              '',
              ' AND ID= ' + Number(sessionStorage.getItem('schoolid'))
            )
            .subscribe((data) => {
              if (data['code'] == 200) {
                if (data['data'].length > 0) {
                  this.institutename = data['data'][0]['SCHOOL_NAME'];
                  this.instiutelogo = data['data'][0]['INSTITUTE_LOGO'];
                  if (this.instiutelogo) {
                    this.institutelogourl =
                      this.imgUrl + 'instituteLogo/' + this.instiutelogo;
                    // console.log(this.institutelogourl);
                  }
                }
                // console.log(this.drawerData);
              } else {
                console.log(data['code']);
              }
            });
        }
        this.loadForms();
      } else {
        this.api.logoutForSessionValues();
      }
    }
  }
  // redirectToAdminDashboard(){
  //   window.location.href='/admindashboard'
  // }
  loadForms() {
    this.api.getForms(this.roleId).subscribe((data) => {
      if (data['code'] == 200 && data['data'] != null) {
        data['data'].forEach((element: any) => {
          element['children'].sort(this.sortFunction);

          if (element['children'].length == 0) delete element['children'];
        });
        this.menus = data['data'].sort(this.sortFunction);
      }
      for (let i = 0; i < data['data'].length; i++) {
        const title = data['data'][i]['title'].toLowerCase();
        const children = data['data'][i]['children'];

        if (title === 'masters' && children.length > 0) {
          for (let j = 0; j < children.length; j++) {
            const childTitle = children[j]['title'].toLowerCase();
            const childLink = children[j]['link'];

            if (
              childTitle === 'holiday master' ||
              childTitle === 'student fee details'
            ) {
              this.seperateMasters.push(children[j]);
            } else {
              // this.formslist.push(children[j]);
            }
          }
        }
      }

      this.seperateMasters.sort((a, b) => {
        return a.SEQ_NO - b.SEQ_NO;
      });
    });
  }
  showFormList() {
    this.isFormListVisible = true;
  }

  DigitalDetoxVisible: boolean = false;
  nzOkLoading: boolean = false;

  DigitalDetox() {
    this.DigitalDetoxVisible = true;
  }

  DigitalDetoxClose() {
    this.DigitalDetoxVisible = false;
    this.data = new APPConfiguration()
  }
  handleOk() {
    console.log(this.data, 'Data');

    var isOk = true;

    if (
      (this.data.MIN_VERSION == undefined ||
        this.data.MIN_VERSION == null ||
        this.data.MIN_VERSION == '') &&
      (this.data.DETOX_DURATION == undefined ||
        this.data.DETOX_DURATION == null ||
        this.data.DETOX_DURATION == '') &&
      (this.data.DETOX_TIME == undefined ||
        this.data.DETOX_TIME == null ||
        this.data.DETOX_TIME == '')
    ) {
      isOk = false;
      this.message.error('Please Fill All Required Details', '');
    } else if (
      this.data.MIN_VERSION == undefined ||
      this.data.MIN_VERSION == null ||
      this.data.MIN_VERSION == ''
    ) {
       isOk = false;
      this.message.error('Please Enter App Version', '');
    } else if (
      this.data.DETOX_TIME == undefined ||
      this.data.DETOX_TIME == null ||
      this.data.DETOX_TIME == ''
    ) {
       isOk = false;
      this.message.error('Please Enter Valid App Max Usage Time', '');
    } else if (
      this.data.DETOX_DURATION == undefined ||
      this.data.DETOX_DURATION == null ||
      this.data.DETOX_DURATION == ''
    ) {
       isOk = false;
      this.message.error('Please Enter Valid Average App Block Time', '');
    }

    if (isOk) {
      this.nzOkLoading = true;

      this.api2.updateAppConfiguration(this.data).subscribe(
        (successCode) => {
          if (successCode.code == 200) {
            this.message.success(' App Configuration Updated Successfully', '');
            this.DigitalDetoxClose();
            this.nzOkLoading = false;
          } else {
            this.message.error('Failed To Update App Configuration', '');
            this.nzOkLoading = false;
          }
        },
        (err) => {
          this.nzOkLoading = false;
        }
      );
    }
  }

  sortFunction(a: any, b: any) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }
  logout() {
    this.cookie.deleteAll();
    sessionStorage.clear();
    localStorage.clear();
    this.cookie.delete('supportKey');
    this.cookie.delete('token');
    this.cookie.delete('userId');
    window.location.reload();
  }

  changepass(): void {
    this.isVisible = true;
  }

  //Notification drawer

  add(): void {
    this.drawerTitle = 'Notification';
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.drawerVisible = false;
  }
  handleCancel() {
    this.isVisible = false;
    window.location.reload();
  }
  // School Profile Change Drawer
  profileDrawerTitle = 'Change Profile Information';
  schoolprofileChangeVisible = false;
  isDrawerLoading = true;
  isChangeable: boolean;
  showState = 0;
  showDistrictByState: any = 0;
  districts: [] = [];
  States: [] = [];
  countries: any = [];
  countryWithStatesAvailable: any;
  drawerData: SchoolMaster = new SchoolMaster();
  isShowBlocked = true;

  profileDrawerOpen(isChangeable: boolean) {
    this.schoolprofileChangeVisible = true;
    this.isChangeable = isChangeable;
    if (sessionStorage.getItem('schoolid')) {
      this.api2
        .getAllSchool(
          0,
          0,
          '',
          '',
          ' AND ID= ' + Number(sessionStorage.getItem('schoolid'))
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data['data'])
            if (
              data.COUNTRY_ID != null &&
              data.COUNTRY_ID != undefined &&
              data.COUNTRY_ID != 0
            ) {
              this.countries = [];
              this.showState = 0;
              this.api2
                .getALLCountry(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID =' + this.drawerData.COUNTRY_ID
                )
                .subscribe(
                  (responseCountryData) => {
                    if (responseCountryData['code'] == 200) {
                      if (responseCountryData['data'].length == 0) {
                        this.countries = [];
                      } else {
                        this.countries = responseCountryData['data'];
                        if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 0) {
                          this.showState = 0;
                          this.showDistrictByState = 0;
                          this.drawerVisible = true;
                        } else if (
                          this.countries[0]?.['IS_STATE_AVALIBLE'] == 1
                        ) {
                          this.showState = 1;
                          this.showDistrictByState = 1;

                          this.api2
                            .getAllStateMaster(
                              0,
                              0,
                              '',
                              '',
                              ' AND STATUS!=false AND COUNTRY_ID = ' +
                                this.drawerData.COUNTRY_ID
                            )
                            .subscribe(
                              (responseStateData) => {
                                if (responseStateData['code'] == 200) {
                                  if (responseStateData['data'].length != 0) {
                                    this.States = responseStateData['data'];
                                    var stateWithDistrictsAvailable = '';
                                    stateWithDistrictsAvailable =
                                      this.States.find(
                                        (state) => state['ID'] === data.STATE_ID
                                      );

                                    if (
                                      stateWithDistrictsAvailable?.[
                                        'IS_DISTRICT_AVALIBLE'
                                      ] == 0
                                    ) {
                                      this.showDistrictByState = 0;
                                      this.drawerVisible = true;
                                    } else if (
                                      stateWithDistrictsAvailable?.[
                                        'IS_DISTRICT_AVALIBLE'
                                      ] == 1
                                    ) {
                                      this.showDistrictByState = 1;

                                      this.api2
                                        .getAllDistrict(
                                          0,
                                          0,
                                          '',
                                          '',
                                          ' AND STATUS!=false AND STATE_ID = ' +
                                            this.drawerData.STATE_ID
                                        )
                                        .subscribe(
                                          (responseData) => {
                                            if (responseData['code'] == 200) {
                                              this.districts =
                                                responseData['data'];
                                              this.drawerVisible = true;
                                            } else {
                                              this.districts = [];
                                            }
                                          },
                                          (err) => {}
                                        );
                                    }
                                  } else {
                                    this.drawerVisible = true;
                                    this.States = [];
                                  }
                                } else {
                                  this.States = [];
                                }
                                this.stateload = false;
                              },
                              (err) => {
                                this.stateload = false;
                              }
                            );
                        }
                      }
                    } else {
                      this.countries = [];
                    }
                  },
                  (err) => {
                    // Handle error if necessary
                  }
                );
            } else {
            }
            this.drawerData = Object.assign({}, data['data'][0]);
            this.isDrawerLoading = false;
            // console.log(this.drawerData);
          } else {
            console.log(data['code']);
          }
        });
    }
  }
  profileDrawerClose() {
    this.schoolprofileChangeVisible = false;
    window.location.reload();
  }
  // Change Class Function
  get closeCallback() {
    return this.profileDrawerClose.bind(this);
  }

  classData: any = [];
  TeacherData: any = [];

  changeTeacher(event: any) {
    console.log(event);

    if (event.CLASS_DATA !== undefined && event.CLASS_DATA !== null) {
      sessionStorage.setItem('yearId', event.YEAR_ID?.toString());
      sessionStorage.setItem('userName', event.NAME?.toString());
      sessionStorage.setItem('roleId', event.ROLE_ID?.toString());
      sessionStorage.setItem('userId', event.ID?.toString());
      sessionStorage.setItem('ClassData', event.CLASS_DATA?.toString());

      this.setClassId(event.CLASS_DATA);

      // window.location.reload();
    } else {
      sessionStorage.setItem('yearId', event.YEAR_ID?.toString());
      sessionStorage.setItem('userName', event.NAME?.toString());
      sessionStorage.setItem('roleId', event.ROLE_ID?.toString());
      sessionStorage.setItem('userId', event.ID?.toString());
      this.classData = [];
      sessionStorage.removeItem('ClassData');
      sessionStorage.removeItem('classid');
      sessionStorage.removeItem('divisionId');
      window.location.reload();
      this.message.error('No Class Mapped To This Teacher', '');
    }
  }
  setClassId(classInfo: any) {
    const abc = JSON.parse(classInfo);
    // console.log( JSON.parse(classInfo),"classinfo",classInfo[0]['CLASS_ID']);

    sessionStorage.setItem('classid', abc[0]['CLASS_ID']);
    sessionStorage.setItem('yearId', abc[0]['YEAR_ID']);
    sessionStorage.setItem('divisionId', abc[0]['DIVISION_ID']);
    sessionStorage.setItem('schoolID', abc[0]['SCHOOL_ID']);

    window.location.reload();
  }

  changeClass(event: any) {
    console.log(event);

    sessionStorage.setItem('classid', event.CLASS_ID.toString());
    sessionStorage.setItem('divisionId', event.DIVISION_ID.toString());
    sessionStorage.setItem('yearId', event.YEAR_ID.toString());

    window.location.reload();
  }
  ClassDataGet() {
    if (this.TeacherDetails && this.TeacherDetails.length > 1) {
      this.TeacherData = JSON.parse(this.TeacherDetails);

      if (this.ClassDetails && this.ClassDetails.length > 1) {
        this.classData = JSON.parse(this.ClassDetails);
        console.log(this.classData);
      } else {
        this.classData = [];
        this.message.error('No Class Mapped To This Teacher', '');
      }
    } else {
      this.TeacherData = [];
    }
    console.log(this.TeacherData);
  }

  closeModal(): void {
    var nd = document.getElementById('rolemapmodclosed');
    nd?.click();
  }
  closeModal1(): void {
    var nd = document.getElementById('rolemapmodclosed1');
    nd?.click();
  }
  isApkVersionModalVisible = false;
  isApkVersionModalConfirmLoading = false;
  apkVersionModalTitle: string = "";

  showApkVersionModal(): void {
    this.api.getAPKInfo(0, 0, "", "", "").subscribe(
      (data) => {
        if (data["code"] == 200) {
          // this.dataList = data['data'];
          this.PREVIOUS_VERSION = data["data"][0]["CUR_VERSION"];
          this.MIN_VERSION=data["data"][0]["MIN_VERSION"];
          this.isApkVersionModalVisible = true;
          this.apkVersionModalTitle = "APK Details";
        }
      },
      (err) => {
        if (this.api.checkOnlineStatus()) {
          // console.log(err);
          this.message.error(
            "The server's internet connection is down. Please contact the EDP department for help.",
            ""
          );
        } else {
          this.message.error(
            "Cannot perform operation due to unstable Internet connection. ",
            ""
          );
        }
      }
    );
  }

  handleApkVersionModalCancel(): void {
    this.isApkVersionModalVisible = false;
    this.isApkVersionModalConfirmLoading = false;
    this.uploadProgress = 0;
    this.isProgressVisible = false;
    this.MIN_VERSION = undefined;
    this.CUR_VERSION = undefined;
    this.fileURL = null;

    if (this.timer != undefined) this.timer.unsubscribe();
  }

  // handleApkVersionModalOk(): void {
  //   var isOk = true;

  //   if (this.MIN_VERSION != undefined) {
  //     if (this.MIN_VERSION.trim() == "") {
  //       isOk = false;

  //       this.message.error("Please Enter Minimum Version", "");
  //     }
  //   } else {
  //     isOk = false;
  //     this.message.error("Please Enter Minimum Version", "");
  //   }

  //   if (this.CUR_VERSION != undefined) {
  //     if (this.CUR_VERSION.trim() == "") {
  //       isOk = false;
  //       this.message.error("Please Enter Current Version", "");
  //     }
  //   } else {
  //     isOk = false;
  //     this.message.error("Please Enter Current Version", "");
  //   }

  //   if (isOk) {

  //     this.isApkVersionModalConfirmLoading = true;
  //     var obj1 = new Object();
  //     obj1["MIN_VERSION"] = this.MIN_VERSION;
  //     obj1["CUR_VERSION"] = this.CUR_VERSION;
  //     obj1["APK_LINK"] = this.uploadedAttachmentStr;
  //     this.apkInformationUpdate(obj1);
  //   }
  // }

  // handleApkVersionModalOk(): void {
  //   var isOk = true;
  //   if (this.PREVIOUS_VERSION != undefined) {
  //     if (this.PREVIOUS_VERSION.trim() == "") {
  //       isOk = false;
  //       this.message.error("Please Enter Previous Version", "");
  //     }
  //   } else {
  //     isOk = false;
  //     this.message.error("Please Enter Previous Version", "");
  //   }
  //   if (this.MIN_VERSION != undefined) {
  //     if (this.MIN_VERSION.trim() == "") {
  //       isOk = false;

  //       this.message.error("Please Enter Minimum Version", "");
  //     }
  //   } else {
  //     isOk = false;
  //     this.message.error("Please Enter Minimum Version", "");
  //   }
  //   if (this.CUR_VERSION != undefined) {
  //     if (this.CUR_VERSION.trim() == "") {
  //       isOk = false;
  //       this.message.error("Please Enter Current Version", "");
  //     }
  //   } else {
  //     isOk = false;
  //     this.message.error("Please Enter Current Version", "");
  //   }
  //   if (isOk) {

  //     this.isApkVersionModalConfirmLoading = true;
  //     var obj1 = new Object();
  //     obj1["PREVIOUS_VERSION"] = this.PREVIOUS_VERSION;
  //     obj1["MIN_VERSION"] = this.MIN_VERSION;
  //     obj1["CUR_VERSION"] = this.CUR_VERSION;
  //     obj1["DESCRIPTION"] = this.DESCRIPTION;
  //     obj1["USER_ID"] = this.userId;;
  //     obj1["DATETIME"] = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
  //     obj1["APK_LINK"] = this.uploadedAttachmentStr;
  //     this.apkInformationUpdate(obj1);
  //   }
  // }

  handleApkVersionModalOk(): void {
    var isOk = true;
    // if (this.PREVIOUS_VERSION != undefined) {
    //   if (this.PREVIOUS_VERSION.trim() == "") {
    //     isOk = false;
    //     this.message.error("Please Enter Previous Version", "");
    //   }
    // } else {
    //   isOk = false;
    //   this.message.error("Please Enter Previous Version", "");
    // }
    if (this.MIN_VERSION != undefined) {
      if (this.MIN_VERSION.trim() == "") {
        isOk = false;

        this.message.error("Please Enter Minimum Version", "");
      }
    } else {
      isOk = false;
      this.message.error("Please Enter Minimum Version", "");
    }
    if (this.CUR_VERSION != undefined) {
      if (this.CUR_VERSION.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Current Version", "");
      }
    } else {
      isOk = false;
      this.message.error("Please Enter Current Version", "");
    }
    if (
      this.DESCRIPTION == "" ||
      this.DESCRIPTION == undefined ||
      this.DESCRIPTION == null
    ) {
      isOk = false;
      this.message.error("Please Enter Description", "");
    }
    if (isOk) {
      this.isApkVersionModalConfirmLoading = true;
      var obj1 = new Object();
      obj1["PREVIOUS_VERSION"] = this.PREVIOUS_VERSION;
      obj1["MIN_VERSION"] = this.MIN_VERSION;
      obj1["CUR_VERSION"] = this.CUR_VERSION;
      obj1["DESCRIPTION"] = this.DESCRIPTION;
      obj1["USER_ID"] = this.userId;
      obj1["DATETIME"] = this.datePipe.transform(
        new Date(),
        "yyyy-MM-dd hh:mm"
      );
      obj1["APK_LINK"] = this.uploadedAttachmentStr;
      this.apkInformationUpdate(obj1);
    }
  }
  DESCRIPTION: any;
  PREVIOUS_VERSION: any;
  MIN_VERSION: any;
  CUR_VERSION: any;
  fileURL: File = null;

  onFileSelected(event) {
    this.fileURL = <File>event.target.files[0];
  }

  clear() {
    this.fileURL = null;
  }

  folderName = "apk";
  uploadedAttachmentStr: string;
  uploadProgress: number = 0;
  isProgressVisible: boolean = false;
  timer: any;
  retriveimgUrl = appkeys.baseUrl + "static/";
  imageUpload() {
    this.uploadedAttachmentStr = "";

    if (this.fileURL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split(".").pop();
      var url = "APK" + number + "." + fileExt;

      this.timer = this.api
        .onFileUploadWithProgress(this.folderName, this.fileURL, url)
        .subscribe(
          (res) => {
            if (res.type === HttpEventType.Response) {
              this.isProgressVisible = false;
              this.uploadedAttachmentStr =
                this.retriveimgUrl + "apk/" + url;
            }

            if (res.type === HttpEventType.UploadProgress) {
              this.isProgressVisible = true;
              const percentDone = Math.round((100 * res.loaded) / res.total);

              this.uploadProgress = percentDone;
            }
          },
          (err) => {
            this.isApkVersionModalConfirmLoading = false;

            if (err["ok"] == false)
              this.message.error("Failed to Upload the File", "");
          }
        );
    }
  }

  apkInformationUpdate(apkData) {
    this.api.updateGlobalSettingInfo(apkData).subscribe(
      (successCode) => {
        if (successCode["code"] == 200) {
          this.message.success("APK Information Updated Successfully", "");
          this.handleApkVersionModalCancel();
        } else {
          this.message.error("APK Information Updation Failed", "");
          this.isApkVersionModalConfirmLoading = false;
        }
      },
      (err) => {
        if (this.api.checkOnlineStatus()) {
          console.log(err);
          this.isApkVersionModalConfirmLoading = false;
          this.message.error(
            "The server's internet connection is down. Please contact the EDP department for help.",
            ""
          );
        } else {
          this.isApkVersionModalConfirmLoading = false;
          this.message.error(
            "Cannot perform operation due to unstable Internet connection. ",
            ""
          );
        }
      }
    );
    // , err => {
    //   this.isApkVersionModalConfirmLoading = false;

    //   if (err['ok'] == false)
    //     this.message.error("Server Not Found", "");
    // });
  }

  numberWithDecimal(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
}
