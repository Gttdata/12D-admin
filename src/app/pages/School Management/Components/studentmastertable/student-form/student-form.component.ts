import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { studentmaster } from '../../../Models/studentmaster';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: studentmaster = new studentmaster();
  @Input()
  drawerVisible: boolean = false;
  isSpinning: boolean = false;
  passwordVisible = false;
  @Input()
  isAdd: boolean = false;
  // cities = [];
  // districts = [];
  // countries = [];
  // states = [];
  public commonFunction = new CommomFunctionsService();
  countryload: boolean;
  @Input()
  countrys: any;
  @Input()
  States: [] = [];
  @Input()
  isShowBlocked: boolean;
  @Input()
  stateload: boolean = false;
  districtload: boolean;
  cityload: boolean;
  citys: any;
  @Input()
  districts: any[];
  @Input()
  taskurl: any = '';
  imgUrl = appkeys.retriveimgUrl;
  divisionload: boolean = false;
  divisionlist: any[] = [];
  isOk = true;
  yearlist = [];
  classlist = [];
  roleId: number;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  close(): void {
    this.drawerClose();
  }
  ngOnInit() {
    // console.log(this.isShowBlocked);
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.getallCountry();
    if (this.isAdd) {
      this.getYearClassforExcel();
      this.getDivision();
      this.GetMediumData();
    }

    this.data.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
  }
  Mediumlist: any = [];
  GetMediumData() {
    this.api
      .getAllMediumMaster(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1  AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Mediumlist = data['data'];
          } else {
            this.Mediumlist = [];
          }
        } else {
          this.message.error('Failed To Get Medium Data.', '');
          this.Mediumlist = [];
        }
      });
  }
  getYearClassforExcel() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', 'AND STATUS!=false ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        } else {
          this.message.error('Failed to Get Year List', ``);
        }
      });
    this.api
      .getAllClassMaster(0, 0, '', '', 'AND STATUS!=false' + extraFilter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.classlist = data['data'];
        } else {
          this.message.error('Failed to Get Class List', ``);
        }
      });
  }
  getDivision() {
    this.divisionload = true;
    var extraFilter: any = '';
    // if(
    //   this.roleId==3 || this.roleId==2
    //       ){
    //         extraFilter=" AND SCHOOL_ID = "+ Number(sessionStorage.getItem('schoolid'))
    //       }
    //       else{
    //         extraFilter=''
    //       }
    this.api
      .getAllDivisions(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
        (division) => {
          if (division.code == 200) {
            this.divisionlist = division['data'];
            this.divisionload = false;
          } else {
            this.message.error('Failed To Get division', '');
            this.divisionload = false;

            this.divisionlist = [];
          }
        },
        (err) => {}
      );
  }
  getallCountry() {
    this.countryload = true;
    this.api.getALLCountry(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countrys = data['data'];
          this.countryload = false;
          // this.getallStates(this.data.COUNTRY_ID);
        } else {
          this.countrys = [];
          this.countryload = false;
        }
      },
      (err) => {
        this.countryload = false;
      }
    );
  }

  @Input()
  countryWithStatesAvailable: any;
  showDistrictByCountry: any = 0;

  @Input()
  showState: any = 1;
  getallStates(data: any) {
    if (this.data.STATE_ID != null) {
      this.data.STATE_ID = '0';
      this.data.DISTRICT_ID = '0';
      this.data.DISTRICT_NAME = '';
      this.data.STATE_NAME = '';
    } else {
    }
    if (data) {
      this.countryWithStatesAvailable = this.countrys.find(
        (country) => country['ID'] === data
      );
      if (this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] == 0) {
        this.showState = 0;
        this.showDistrictByState = 0;
      } else if (this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] == 1) {
        this.showState = 1;

        this.showDistrictByState = 1;
      }
    }

    // console.log(this.countrys);

    if (
      !this.countryWithStatesAvailable ||
      this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] === false
    ) {
    } else {
      this.stateload = true;
      this.api
        .getAllStateMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND COUNTRY_ID = ' + data
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.States = data['data'];
              this.stateload = false;
              this.getALlDistrict(this.data.STATE_ID);
            } else {
              this.States = [];
              this.stateload = false;
            }
          },
          (err) => {
            this.stateload = false;
          }
        );
    }
  }

  @Input()
  showDistrictByState: any = 0;
  stateWithDistrictsAvailable: any;
  getALlDistrict(data: any) {
    if (this.data.DISTRICT_ID != null) {
      this.data.DISTRICT_ID = '0';
      this.data.DISTRICT_NAME = '';
    } else {
    }
    this.stateWithDistrictsAvailable = this.States.find(
      (state) => state['ID'] === data
    );
    if (this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] == 0) {
      this.showDistrictByState = 0;
    } else if (this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] == 1) {
      this.showDistrictByState = 1;
    }

    if (
      !this.stateWithDistrictsAvailable ||
      this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] === false
    ) {
    } else {
      this.districtload = true;
      this.api
        .getAllDistrict(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND STATE_ID = ' + data
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.districts = data['data'];
              this.districtload = false;
            } else {
              this.districts = [];
              this.districtload = false;
            }
          },
          (err) => {
            this.districtload = false;
          }
        );
    }
  }
  // getAllCity(data: any) {
  //   console.log(data.ID);

  //   this.cityload = true;
  //   this.api
  //     .getAllCityMaster(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND STATUS!=false AND DISTRICT_ID = ' + data
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.citys = data['data'];
  //           this.cityload = false;
  //         } else {
  //           this.citys = [];
  //           this.cityload = false;
  //         }
  //       },
  //       (err) => {
  //         this.cityload = false;
  //       }
  //     );
  // }
  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  onFileSelected(event: any) {
    this.fileList2 = <File>event.target.files[0];

    if (
      (event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png') &&
      event.target.files[0].size < 10240000
    ) {
      const img = new Image();
      const reader = new FileReader();

      img.src = window.URL.createObjectURL(event.target.files[0]);

      img.onload = () => {
        // console.log(img.width,img.height)
        if (img.width < 400 && img.height < 400) {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileList2.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.data.PROFILE_PHOTO != undefined &&
            this.data.PROFILE_PHOTO.trim() != ''
          ) {
            const arr = this.data.PROFILE_PHOTO.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.isSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('appUserProfile', this.fileList2, url)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentProfilePhoto = percentDone;
                if (this.percentProfilePhoto == 100) {
                  this.isSpinning = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Image...', '');
                this.isSpinning = false;
                this.progressBarProfilePhoto = false;
                this.percentProfilePhoto = 0;
                this.data.PROFILE_PHOTO = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.isSpinning = false;
                  this.data.PROFILE_PHOTO = url;
                  this.taskurl =
                    this.imgUrl + 'appUserProfile/' + this.data.PROFILE_PHOTO;
                } else {
                  this.isSpinning = false;
                }
              }
            });
        } else {
          this.message.error(
            'Image dimensions must be less than 400 x 400 pixels.',
            ''
          );
          this.fileList2 = null;
          this.data.PROFILE_PHOTO = null;
        }
      };
    } else {
      this.message.error(
        'Please Select Only JPEG/JPG/PNG Extension and file size less than 10MB.',
        ''
      );
      this.fileList2 = null;
    }
  }
  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api
        .deletePdf('appUserProfile/' + data.PROFILE_PHOTO)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.PROFILE_PHOTO = null;
            this.api.updateStudent(this.data).subscribe((updateCode) => {
              if (updateCode.code == '200') {
                this.isSpinning = false;
              } else {
                this.message.error(' Image Has Not Saved...', '');
                this.isSpinning = false;
              }
            });
            this.message.success(' Image deleted...', '');
          } else {
            this.message.error(' Image Has Not Deleted...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.data.PROFILE_PHOTO = null;
      data.PROFILE_PHOTO = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (this.data.DOB) {
      this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');
    }
    if (
      (this.data.NAME == undefined ||
        this.data.NAME == null ||
        this.data.NAME.trim() == '') &&
      (this.data.DOB == undefined || this.data.DOB == null) &&
      (this.data.MOBILE_NUMBER <= 0 ||
        this.data.MOBILE_NUMBER == null ||
        this.data.MOBILE_NUMBER == undefined) &&
      (this.data.GENDER == '' ||
        this.data.GENDER == null ||
        this.data.GENDER == undefined)&&
      (this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS.trim() == '') &&
      (this.data.STATE_ID == undefined ||
        this.data.STATE_ID == null ||
        this.data.STATE_NAME == '') &&
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_NAME == '') &&
      (this.data.YEAR_ID == undefined ||
        this.data.YEAR_ID == null ||
        this.data.YEAR_ID <= 0) &&
      (this.data.CLASS_ID == undefined ||
        this.data.CLASS_ID == null ||
        this.data.CLASS_ID <= 0) &&
      (this.data.DIVISION_ID == undefined ||
        this.data.DIVISION_ID == null ||
        this.data.DIVISION_ID < 0) &&
      (this.data.ROLL_NUMBER == null ||
        this.data.ROLL_NUMBER == undefined ||
        this.data.ROLL_NUMBER <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME.trim() == '' ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Student Name', '');
    } else if (
      this.data.MOBILE_NUMBER == null ||
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER.toString())
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.data.PASSWORD == undefined ||
      this.data.PASSWORD == null ||
      this.data.PASSWORD == '' ||
      this.data.PASSWORD == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (this.data.DOB == undefined || this.data.DOB == null) {
      this.isOk = false;
      this.message.error(' Please Select Birth Date ', '');
    } else if (
      this.data.GENDER == undefined ||
      this.data.GENDER == null ||
      this.data.GENDER.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Gender ', '');

      // } else if (
      //   this.data.IDENTITY_NUMBER == '' ||
      //   this.data.IDENTITY_NUMBER == null ||
      //   this.data.IDENTITY_NUMBER == undefined
      // ) {
    } 
    
    // else if (
    //   this.isShowBlocked &&
    //   this.data.APPROVAL_STATUS == undefined ||
    //   this.data.APPROVAL_STATUS == null
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Student Status ', '');
    // }
    else if (
      this.data.APPROVAL_STATUS == 'R' &&
      (this.data.REJECT_BLOCKED_REMARK == null ||
        this.data.REJECT_BLOCKED_REMARK == undefined ||
        this.data.REJECT_BLOCKED_REMARK == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    } else if (
      this.data.APPROVAL_STATUS == 'B' &&
      (this.data.REJECT_BLOCKED_REMARK == null ||
        this.data.REJECT_BLOCKED_REMARK == undefined ||
        this.data.REJECT_BLOCKED_REMARK == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Blocked Remark', '');
    } else if (
      this.data.ADDRESS == undefined ||
      this.data.ADDRESS == null ||
      this.data.ADDRESS.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Address ', '');
    } else if (
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Country', '');
    } else if (
      (this.data.STATE_ID == undefined ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID <= 0) &&
      this.showState == 1
    ) {
      this.isOk = false;
      this.message.error(' Please Select State', '');
    } else if (
      (this.data.STATE_NAME == undefined ||
        this.data.STATE_NAME == null ||
        this.data.STATE_NAME == '') &&
      this.showState == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter State', '');
    } else if (
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID <= 0) &&
      this.showDistrictByState == 1
    ) {
      this.isOk = false;
      this.message.error(' Please Select District', '');
    } else if (
      (this.data.DISTRICT_NAME == undefined ||
        this.data.DISTRICT_NAME == null ||
        this.data.DISTRICT_NAME == '') &&
      this.showDistrictByState == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter District', '');
    } else if (
      (this.data.YEAR_ID == undefined ||
        this.data.YEAR_ID == null ||
        this.data.YEAR_ID <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      (this.data.CLASS_ID == undefined ||
        this.data.CLASS_ID == null ||
        this.data.CLASS_ID <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      (this.data.DIVISION_ID == undefined ||
        this.data.DIVISION_ID == null ||
        this.data.DIVISION_ID < 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      (this.data.MEDIUM_ID == undefined ||
        this.data.MEDIUM_ID == null ||
        this.data.MEDIUM_ID < 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Medium', '');
    } else if (
      (this.data.ROLL_NUMBER == null ||
        this.data.ROLL_NUMBER == undefined ||
        this.data.ROLL_NUMBER <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Enter Roll Number.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      this.data.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      
      if (this.data.APPROVAL_STATUS == 'A' || this.data.APPROVAL_STATUS == 'P') {
        this.data.REJECT_BLOCKED_REMARK = ' '
      }
      if (this.data.ID) {
        if(this.data.APPROVAL_STATUS == 'B'){
          this.data.STATUS=0
        }
        else{
          this.data.STATUS=1

        }
        this.api.updateStudent(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Student Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Student Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        var data={
          studentData:[this.data],
          ROLE:'S',
          CLASS_ID:this.data.CLASS_ID,
          YEAR_ID:this.data.YEAR_ID,
          SCHOOL_ID:this.data.SCHOOL_ID,
          DIVISION_ID:this.data.DIVISION_ID,
          MEDIUM_ID:this.data.MEDIUM_ID,
          

        }
        this.api.createStudent(data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Student Information Save Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.data = new studentmaster();
              this.resetDrawer(websitebannerPage);
              // this.api
              //   .getAllstudents(
              //     1,
              //     1,
              //     '',
              //     'desc',
              //     'AND SCHOOL_ID =' + Number(sessionStorage.getItem('schoolid'))
              //   )
              //   .subscribe(
              //     (data) => {
              //       if (data['code'] == 200) {
              //         if (data['count'] == 0) {
              //           this.data.SEQ_NO = 1;
              //         } else {
              //           this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
              //         }
              //       } else {
              //       }
              //     },
              //     (err) => {}
              //   );
            }
            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Fee Details Not Found...',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Student Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  open5YearAgo(event) {
    if (!this.data.ID) {
      if (
        this.data.DOB == null ||
        this.data.DOB == undefined ||
        this.data.DOB == ''
      ) {
        var defaultDate = new Date();
        var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 5);
        this.data.DOB = bod;
      }
    } else if (
      this.data.DOB == null ||
      this.data.DOB == undefined ||
      this.data.DOB == ''
    ) {
      var defaultDate = new Date();
      var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 5);
      this.data.DOB = bod;
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new studentmaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
