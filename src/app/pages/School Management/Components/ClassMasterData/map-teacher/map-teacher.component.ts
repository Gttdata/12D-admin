import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { SubjectMaster } from 'src/app/pages/Task Management/Models/SubjectMaster';
export class TeacherMap {
  CLASS_NAME: string = '';
  DIVISION_ID: any = null;
  CLASS_ID: number;
  YEAR_ID: any = null;
  CLASS_TEACHER_ID: any;

  TEACHER_ID: number;
  SUBJECT_ID: number;
  STATUS: boolean = true;
}
@Component({
  selector: 'app-map-teacher',
  templateUrl: './map-teacher.component.html',
  styleUrls: ['./map-teacher.component.css'],
})
export class MapTeacherComponent implements OnInit {
  @Input()
  drawerClose: any = Function;
  @Input()
  drawerVisible: boolean = false;
  drawerVisible1: boolean = false;

  @Input()
  Class_ID;
  @Input()
  CLASS_NAME;

  @Input()
  MapTeacherData: any[] = [];

  MapTeacher: any[] = [];
  TeacherMapData: TeacherMap = new TeacherMap();
  loadingRecords: boolean = false;

  TeacherDetais: any[] = [];
  drawerData: SubjectMaster = new SubjectMaster();
  drawerTitle!: string;
  roleId: any;

  promoteisSpinning = false;
  classesload: boolean;
  classes: any[] = [];
  drawerTitle1: string;
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.TeacherMapData.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.TeacherMapData.CLASS_ID = this.Class_ID;
    this.TeacherMapData.CLASS_NAME = this.CLASS_NAME;
    this.GetYearData();
    this.GetTeachersData();
    this.GetDivisionData();
  }

  YearDatalist: any = [];
  loadYearData: boolean = false;

  getAllClasses() {
    // if (this.roleId == 2) {
    //   var extraFilter: any = '';
    //   extraFilter =
    //     'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    // } else {
    //   extraFilter = ' ';
    // }
    this.classesload = true;
    this.api.getAllClassMaster(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.classes = data['data'];
          this.classesload = false;
        } else {
          this.classes = [];
          this.classesload = false;
        }
      },
      (err) => {
        this.classesload = false;
      }
    );
  }
  GetYearData() {
    this.loadYearData = true;

    this.api
      .getAllYearMaster(0, 0, '', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.YearDatalist = data['data'];

            this.loadYearData = false;
          } else {
            this.YearDatalist = [];
            this.loadYearData = false;
          }
        } else {
          this.message.error('Failed To Get Year Data.', '');
          this.YearDatalist = [];
          this.loadYearData = false;
        }
      });
  }

  Divisionlist: any = [];
  loadDivision: boolean = false;
  GetDivisionData() {
    this.loadDivision = true;
    this.api
      .getAllDivisions(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Divisionlist = data['data'];
            this.loadDivision = false;
          } else {
            this.Divisionlist = [];
            this.loadDivision = false;
          }
        } else {
          this.message.error('Failed To Get Division Data.', '');
          this.Divisionlist = [];
          this.loadDivision = false;
        }
      });
  }

  Teacherlist: any = [];
  loadTeacher: boolean = false;
  GetTeachersData() {
    this.loadTeacher = true;
    this.api
      .getALLTeacher(
        0,
        0,
        '',
        '',
        ' AND STATUS=1  AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid')) + ' AND ROLE = "T"' 
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Teacherlist = data['data'];
            this.loadTeacher = false;
          } else {
            this.Teacherlist = [];
            this.loadTeacher = false;
          }
        } else {
          this.message.error('Failed To Get Division Data.', '');
          this.Teacherlist = [];
          this.loadTeacher = false;
        }
      });
  }

  ChangedDivision(data: any) {
    if (data != null && data != undefined && data != '') {
      // if (this.TeacherMapData.DIVISION_ID != null && this.TeacherMapData.DIVISION_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
            this.Class_ID +
            ' AND DIVISION_ID = ' +
            data +
            ' AND YEAR_ID = ' +
            this.TeacherMapData.YEAR_ID
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacher = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacher = this.MapTeacherData;

                // this.loadClassTeachersMapping(data);
                this.loadClassTeachersMapping(data, 'CLASS_TEACHER_ID');
              } else {
                this.loadSubjects(data, 'CLASS_TEACHER_ID');
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
  }

  ChangedYear(data: any) {
    if (data != null && data != undefined && data != '') {
      // if (this.TeacherMapData.YEAR_ID != null && this.TeacherMapData.YEAR_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
            this.Class_ID +
            ' AND DIVISION_ID = ' +
            this.TeacherMapData.DIVISION_ID +
            ' AND YEAR_ID = ' +
            data
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacher = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacher = this.MapTeacherData;

                this.loadClassTeachersMapping(data, 'TEACHER_ID');
              } else {
                this.loadSubjects(data, 'TEACHER_ID');
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
  }

  loadClassTeachersMapping(data: any, teacherType: string) {
    let extrafilter = '';
    if (teacherType == 'CLASS_TEACHER_ID') {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        data +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND YEAR_ID = ' +
        this.TeacherMapData.YEAR_ID;
    } else {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        this.TeacherMapData.DIVISION_ID +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND YEAR_ID = ' +
        data;
    }
    this.api
      .getALLClassTeacherMappingMaster(0, 0, '', '', extrafilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['count']>0) {
            // this.MapTeacher = data['data'];
        
            this.TeacherMapData.CLASS_TEACHER_ID =
              data['data'][0]['TEACHER_ID'];

            this.loadingRecords = false;
            //
          } else {
            this.TeacherMapData.CLASS_TEACHER_ID = '';
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  loadSubjects(data: any, teacherType: string) {
    let extrafilter = '';

    if (teacherType == 'CLASS_TEACHER_ID') {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        data +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid'));
    } else {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        this.TeacherMapData.DIVISION_ID +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid'));
    }
    this.api.getAllSubjectMaster(0, 0, '', '', extrafilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.MapTeacher = data['data'];
          console.log(data['data'],'Map Teacher Data')
          this.loadingRecords = false;
          this.MapTeacher.forEach((teacher) => {
            teacher.TEACHER_ID = null;
          });
          this.TeacherMapData.CLASS_TEACHER_ID = null;

          //
        } else {
          this.MapTeacher = [];

          this.loadingRecords = false;
        }
      },
      (err) => {}
    );
  }
  // YearDatalist: any = [];
  // loadYearData: boolean = false;
  // GetYearData() {
  //   this.loadYearData = true;

  //   this.api
  //     .getAllYearMaster(0, 0, '', 'asc', ' AND STATUS=1')
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         if (data['data'].length > 0) {
  //           this.YearDatalist = data['data'];
  //           this.loadYearData = false;
  //         } else {
  //           this.YearDatalist = [];
  //           this.loadYearData = false;
  //         }
  //       } else {
  //         this.message.error('Failed To Get Year Data.', '');
  //         this.YearDatalist = [];
  //         this.loadYearData = false;
  //       }
  //     });
  // }
  add(): void {
    this.drawerTitle1 = ' Add Subject ';
    this.drawerData = new SubjectMaster();
    this.drawerData.CLASS_ID = this.Class_ID;
    this.drawerData.DIVISION_ID = this.TeacherMapData.DIVISION_ID;
    this.drawerData.YEAR_ID=this.TeacherMapData.YEAR_ID
    // this.drawerData.TEACHER_ID=this.TeacherMapData.TEACHER_ID
    this.getAllClasses();
    // if (this.roleId == 2) {
    //   var extraFilter: any = '';
    //   extraFilter =
    //     'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    // } else {
    //   extraFilter = ' ';
    // }

    this.api.getAllSubjectMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible1 = true;
        }
      },
      (err) => {}
    );
  }
  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;

  switchValue = true;
  isOk = true;
  TEACHER_ID: any;
  drawerClose1(): void {
    // this.search();
    // this.api.getSubjectTeacherMappingData(0,0,'','',' AND STATUS=1').subscribe(data=>{
    //   if(data['code']==200){
    //     this.MapTeacher=data['data']
    //   }
    //   else{
    //     this.MapTeacher=[]
    //   }
    // })

    

    if (this.drawerData.DIVISION_ID != null && this.drawerData.CLASS_ID != null && this.drawerData.YEAR_ID != null ) {
      // if (this.TeacherMapData.DIVISION_ID != null && this.TeacherMapData.DIVISION_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
          this.drawerData.CLASS_ID  +
            ' AND DIVISION_ID = ' +
            this.drawerData.DIVISION_ID  +
            ' AND YEAR_ID = ' +
            this.drawerData.YEAR_ID 
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacher = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacher = this.MapTeacherData;

                // this.loadClassTeachersMapping(data);
                this.loadClassTeachersMapping(this.drawerData.DIVISION_ID, 'CLASS_TEACHER_ID');
              } else {
                this.loadSubjects(this.drawerData.DIVISION_ID, 'CLASS_TEACHER_ID');
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
    this.drawerVisible1 = false;
  }
  close1(): void {
    this.drawerClose1();
  }
  isOk1 = true;
  isSpinning = false;
  save2(addNew: boolean, websitebannerPage: NgForm) {
    this.isOk1 = true;
    this.isSpinning = true;
    if (this.drawerData.NAME == '' || this.drawerData.NAME.trim() == '') {
      this.isOk1 = false;
      this.message.error('Please Enter Subject Name', '');
      this.isSpinning = false;
    } else {
      this.api.mapSubject(this.drawerData).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success(
            ' Subject Information Saved Successfully...',
            ''
          );
          this.isSpinning = false;

          if (!addNew) this.drawerClose1();
          else {
            this.drawerData = new SubjectMaster();
            // if (this.roleId == 2) {
            //   var extraFilter: any = '';
            //   extraFilter =
            //     'AND SCHOOL_ID = ' +
            //     Number(sessionStorage.getItem('schoolid'));
            // } else {
            //   extraFilter = ' ';
            // }
            this.resetDrawer(websitebannerPage);
            this.api.getAllSubjectMaster(1, 1, '', 'desc', '').subscribe(
              (data) => {
                if (data['code'] == 200) {
                  if (data['count'] == 0) {
                    this.drawerData.SEQ_NO = 1;
                  } else {
                    this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                  }
                } else {
                }
              },
              (err) => {}
            );
          }
          this.isSpinning = false;
        } else {
          this.message.error(' Failed To Save Subject Information...', '');
          this.isSpinning = false;
        }
      });
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new SubjectMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  save(): void {
    this.isOk = true;
    this.switchValue = true;

    if (
      this.TeacherMapData.DIVISION_ID == undefined ||
      this.TeacherMapData.DIVISION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.TeacherMapData.YEAR_ID == undefined ||
      this.TeacherMapData.YEAR_ID == null ||
      this.TeacherMapData.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.TeacherMapData.CLASS_TEACHER_ID == undefined ||
      this.TeacherMapData.CLASS_TEACHER_ID == null ||
      this.TeacherMapData.CLASS_TEACHER_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class Teacher', '');
    } else if (this.MapTeacher.length === 0) {
      this.isOk = false;
      this.message.error('No Subjects To Map Teacher...', '');
    } else if (this.MapTeacher.some((item) => !item.TEACHER_ID)) {
      this.isOk = false;
      this.message.error("Please Assign Teacher To All Subject's", '');
    } else {
      this.switchValue = false;
    }
  }

  confirm() {
    if (this.isOk) {
      const dataToSave = {
        YEAR_ID: this.TeacherMapData.YEAR_ID,
        CLASS_ID: this.TeacherMapData.CLASS_ID,
        DIVISION_ID: this.TeacherMapData.DIVISION_ID,
        CLASS_TEACHER_ID: this.TeacherMapData.CLASS_TEACHER_ID,
        SUBJECT_DETAILS: [],
      };
      var subjectId:any;
      this.MapTeacher.forEach((item) => {
        if(item.SUBJECT_ID){
          subjectId = item.SUBJECT_ID;
        }
        else{
          subjectId = item.ID;

        }
        const teacherId = item.TEACHER_ID;
        const teacherName = item.NAME;
        dataToSave.SUBJECT_DETAILS.push({
          SUBJECT_ID: subjectId,
          TEACHER_ID: teacherId,
          NAME: teacherName,
          STATUS: 1,
        });
      });
      console.log(this.MapTeacher,dataToSave)
      this.api.ClassTeacherMap(dataToSave).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' Teacher Mapping successfully...', '');
          this.promoteisSpinning = false;
          this.close();
        } else {
          this.message.error('Teacher Mapping Failed...', '');
          this.promoteisSpinning = false;
        }
      });
    }
  }
  close(): void {
    this.drawerClose();
  }
}
