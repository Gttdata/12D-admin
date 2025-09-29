import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { SchoolMaster } from '../../../Models/SchoolMaster';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { StateMaster } from 'src/app/pages/Masters/Models/StateMaster';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-addschoolmaster',
  templateUrl: './addschoolmaster.component.html',
  styleUrls: ['./addschoolmaster.component.css'],
})
export class AddschoolmasterComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: SchoolMaster = new SchoolMaster();
  @Input() drawerVisible: boolean = false;
  @Input() dataList: any[] = [];
  @Input() isSpinning = false;
  @Input()
  isShowBlocked: boolean;
  @Input()
  isChangeable = true;
  passwordVisible = false;
  roleid: any;
  @Input()
  States: [] = [];
  @Input()
  stateload: boolean = false;
  sessionValue = sessionStorage.getItem('countrydata');
  @Input()
  districts: [] = [];
  districtload: boolean = false;
  citys: [] = [];
  cityload: boolean = false;
  board: [] = [];
  boarddataLoad: boolean = false;
  yearlist: [] = [];
  yearsload: boolean = false;
  boardmedium: any[] = [];
  @Input()
  countrys: [] = [];
  countryload: boolean = true;
  boardmediumload: boolean = true;
  @Input()
  isEdit = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  public commonFunction = new CommomFunctionsService();

  ngOnInit() {
    this.getallBoardType();
    // if(!this.isEdit){
    this.getallCountry();
    // }
    this.getYearClassforExcel();
    // this.data.COUNTRY_ID=1
    // if(this.countrys.length>0){
    // }
  }

  getYearClassforExcel() {
    this.yearsload = true;

    this.api
      .getAllYearMaster(0, 0, 'YEAR', 'asc', 'AND STATUS!=false ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
          this.yearsload = false;
        } else {
          this.message.error('Failed to Get Year List', ``);
          this.yearsload = false;
        }
      });
  }
  getallBoardType() {
    this.boarddataLoad = true;
    this.boardmediumload = true;
    this.api
      .getAllBoardMaster(0, 0, 'NAME', 'asc', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.board = data['data'];
            this.boarddataLoad = false;
          } else {
            this.board = [];
            this.boarddataLoad = false;
          }
        },
        (err) => {
          this.boarddataLoad = false;
        }
      );
    this.api
      .getAllBoardMediumMaster(0, 0, 'NAME', 'asc', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.boardmedium = data['data'];
            this.boardmediumload = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.boardmediumload = false;
            this.boardmedium = [];
          }
        },
        (err) => {}
      );
  }

  getallCountry() {
    this.countryload = true;
    this.api.getALLCountry(0, 0, 'NAME', 'asc', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countrys = data['data'];
          this.countryload = false;
          this.getallStates(this.data.COUNTRY_ID);
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
    //  console.log(data,this.countrys)

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
  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = appkeys.retriveimgUrl;

  onFileSelected(event: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          if (img.width < 832 && img.height < 596) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList2.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.data.INSTITUTE_LOGO != undefined &&
              this.data.INSTITUTE_LOGO.trim() != ''
            ) {
              const arr = this.data.INSTITUTE_LOGO.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto = true;
            this.timerThree = this.api
              .onUpload('instituteLogo', this.fileList2, url)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  console.log(percentDone);

                  this.percentProfilePhoto = percentDone;
                  if (this.percentProfilePhoto == 100) {
                    this.isSpinning = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning = false;
                  this.progressBarProfilePhoto = false;
                  this.percentProfilePhoto = 0;
                  this.data.INSTITUTE_LOGO = null;
                  this.taskurl = '';
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning = false;
                    this.data.INSTITUTE_LOGO = url;
                    this.taskurl =
                      this.imgUrl + 'instituteLogo/' + this.data.INSTITUTE_LOGO;
                  } else {
                    this.isSpinning = false;
                  }
                }
              });
          } else {
            this.message.error(
              'Image dimensions must be between 832 x 596 pixels.',
              ''
            );
            this.fileList2 = null;
            this.data.INSTITUTE_LOGO = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.data.INSTITUTE_LOGO = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api
        .deletePdf('instituteLogo/' + data.INSTITUTE_LOGO)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.INSTITUTE_LOGO = null;
            this.api.updateSchool(this.data).subscribe((updateCode) => {
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
      this.data.INSTITUTE_LOGO = null;
      data.INSTITUTE_LOGO = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  save(addNew: boolean, form: NgForm): void {
    //
    let isOk = true;

    if (
      (this.data.SCHOOL_NAME == '' ||
        this.data.SCHOOL_NAME == null ||
        this.data.SCHOOL_NAME == undefined) &&
      // (this.data.SHORT_CODE == '' ||
      //   this.data.SHORT_CODE == null ||
      //   this.data.SHORT_CODE == undefined) &&
      (this.data.PRINCIPLE_NAME == '' ||
        this.data.PRINCIPLE_NAME == null ||
        this.data.PRINCIPLE_NAME == undefined) &&
      (this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined) &&
      (this.data.UPI_ID <= 0 ||
        this.data.UPI_ID == null ||
        this.data.UPI_ID == undefined) &&
      (this.data.PHONE_NUMBER <= 0 ||
        this.data.PHONE_NUMBER == null ||
        this.data.PHONE_NUMBER == undefined) &&
      (this.data.PINCODE <= 0 ||
        this.data.PINCODE == null ||
        this.data.PINCODE == undefined) &&
      (this.data.ADDRESS == '' ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == undefined) &&
      (this.data.COUNTRY_ID <= 0 ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == undefined) &&
      (this.data.STATE_ID <= 0 ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID == undefined) &&
      (this.data.DISTRICT_ID <= 0 ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == undefined) &&
      (this.data.BOARD_ID <= 0 ||
        this.data.BOARD_ID == null ||
        this.data.BOARD_ID == undefined) &&
      (this.data.BOARD_MEDIUM_ID <= 0 ||
        this.data.BOARD_MEDIUM_ID == null ||
        this.data.BOARD_MEDIUM_ID == undefined) &&
      (this.data.YEAR_ID <= 0 ||
        this.data.YEAR_ID == null ||
        this.data.YEAR_ID == undefined)
    ) {
      isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.data.SCHOOL_NAME == undefined ||
      this.data.SCHOOL_NAME == null ||
      this.data.SCHOOL_NAME.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter School Name ', '');
    }
    // else if (
    //   this.data.SHORT_CODE == undefined ||
    //   this.data.SHORT_CODE == null ||
    //   this.data.SHORT_CODE.trim() == ''
    // ) {
    //   isOk = false;
    //   this.message.error('Please Enter School Short Code', '');
    // }
    else if (
      this.data.PRINCIPLE_NAME == undefined ||
      this.data.PRINCIPLE_NAME == null ||
      this.data.PRINCIPLE_NAME.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter School Head Name ', '');
    } else if (
      this.data.BOARD_ID == undefined ||
      this.data.BOARD_ID == null ||
      this.data.BOARD_ID <= 0
    ) {
      isOk = false;
      this.message.error('Please Select Board', '');
    } else if (
      this.data.BOARD_MEDIUM_ID == undefined ||
      this.data.BOARD_MEDIUM_ID == null ||
      this.data.BOARD_MEDIUM_ID <= 0
    ) {
      isOk = false;
      this.message.error('Please Select Board Medium', '');
    } else if (
      this.data.YEAR_ID == undefined ||
      this.data.YEAR_ID == null ||
      this.data.YEAR_ID <= 0
    ) {
      isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Sequence No', '');
    }

    // else if (
    //   this.isShowBlocked && this.data.SCHOOL_STATUS == undefined ||
    //   this.data.SCHOOL_STATUS == null ||
    //   this.data.SCHOOL_STATUS.trim() == ''
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select School Status', '');
    // } else if (
    //   this.data.SCHOOL_STATUS == 'R' &&
    //   (this.data.REJECT_BLOCKED_REMARK == null ||
    //     this.data.REJECT_BLOCKED_REMARK == undefined ||
    //     this.data.REJECT_BLOCKED_REMARK == '')
    // ) {
    //   isOk = false;
    //   this.message.error('Please Enter Reject Remark', '');
    // }
    else if (
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Email Id', '');
    } else if (!this.commonFunction.emailpattern.test(this.data.EMAIL_ID)) {
      isOk = false;
      this.message.error('Please Enter Valid Email Id.', '');
    } else if (
      this.data.PHONE_NUMBER == null ||
      this.data.PHONE_NUMBER == undefined ||
      this.data.PHONE_NUMBER <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(this.data.PHONE_NUMBER.toString())
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.data.PASSWORD == undefined ||
      this.data.PASSWORD == null ||
      this.data.PASSWORD.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (
      this.data.ACC_NO != undefined &&
      this.data.ACC_NO != null &&
      this.data.ACC_NO != '' &&
      !this.commonFunction.Accountpatt.test(this.data.ACC_NO)
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Account Number.', '');
    } else if (
      this.data.IFSC_CODE != undefined &&
      this.data.IFSC_CODE != null &&
      this.data.IFSC_CODE != '' &&
      !this.commonFunction.IFSCpatt.test(this.data.IFSC_CODE)
    ) {
      isOk = false;
      this.message.error('Please Enter Valid IFSC Code.', '');
    } else if (
      this.data.UPI_ID != undefined &&
      this.data.UPI_ID != null &&
      this.data.UPI_ID != '' &&
      !this.commonFunction.upiid.test(this.data.UPI_ID)
    ) {
      isOk = false;
      this.message.error('Please Enter Valid UPI ID.', '');
    } else if (
      this.data.SCHOOL_STATUS == 'B' &&
      (this.data.REJECT_BLOCKED_REMARK == null ||
        this.data.REJECT_BLOCKED_REMARK == undefined ||
        this.data.REJECT_BLOCKED_REMARK == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Blocked Remark', '');
    } else if (
      this.data.ADDRESS == undefined ||
      this.data.ADDRESS == null ||
      this.data.ADDRESS.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Address', '');
    } else if (
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID <= 0
    ) {
      isOk = false;
      this.message.error(' Please Select Country', '');
    } else if (
      (this.data.STATE_ID == undefined ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID <= 0) &&
      this.showState == 1
    ) {
      isOk = false;
      this.message.error(' Please Select State', '');
    } else if (
      (this.data.STATE_NAME == undefined ||
        this.data.STATE_NAME == null ||
        this.data.STATE_NAME == '') &&
      this.showState == 0
    ) {
      isOk = false;
      this.message.error(' Please Enter State', '');
    } else if (
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID <= 0) &&
      this.showDistrictByState == 1
    ) {
      isOk = false;
      this.message.error(' Please Select District', '');
    } else if (
      (this.data.DISTRICT_NAME == undefined ||
        this.data.DISTRICT_NAME == null ||
        this.data.DISTRICT_NAME == '') &&
      this.showDistrictByState == 0
    ) {
      isOk = false;
      this.message.error(' Please Enter District', '');
    } else if (
      this.data.PINCODE == null ||
      this.data.PINCODE == undefined ||
      this.data.PINCODE <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Pincode', '');
    } else if (
      !this.commonFunction.pinpatt.test(this.data.PINCODE.toString())
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Pincode', '');
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.STATE_ID == null) {
        this.data.STATE_ID = '0';
      }

      if (this.data.DISTRICT_ID == null) {
        this.data.DISTRICT_ID = '0';
      }

      if (this.data.ID) {
        this.data.STEP_NO = 0;

        this.api.updateSchool(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('School Details Updated Successfully', '');

            if (!addNew) this.drawerClose();

            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('School Details Updation Failed', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createSchool(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('School Details Created Successfully', '');

            if (!addNew) this.drawerClose();
            else {
              this.data = new SchoolMaster();
              this.resetDrawer(form);

              this.api.getAllSchool(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.data.SEQ_NO = 1;
                    } else {
                      this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  } else {
                  }
                },
                (err) => {}
              );
            }

            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('School Details Creation Failed', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new SchoolMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
