import { Component, Input, OnInit } from '@angular/core';
import { classmaster, promoteStudent } from '../../../Models/classmaster';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-promotedstudent',
  templateUrl: './promotedstudent.component.html',
  styleUrls: ['./promotedstudent.component.css'],
})
export class PromotedstudentComponent implements OnInit {
  @Input() promotedrawerClose!: Function;
  @Input() data: classmaster = new classmaster();
  promotedata: promoteStudent = new promoteStudent();

  @Input() promotedrawerVisible: boolean = false;
  @Input() Promotestudent: any[] = [];
  @Input() promoteisSpinning = false;
  yearlist = [];
  classlist = [];
  isOk = true;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.updateTotalRecords();
    this.getYearClassforExcel();
    this.GetDivisionData();
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
  loadingRecords: boolean = false;
  ChangeDivision(data: any) {
    this.loadingRecords = true;
    // console.log(this.data)
    if (data != null && data != undefined && data != '') {
      var filterDivision = '';
      var filterYear = '';
      if (data) {
        filterDivision = ' AND DIVISION_ID= ' + data;
      } else {
        filterDivision = '';
      }
      if (this.promotedata.YEAR) {
        filterYear = ' AND YEAR_ID = ' + this.promotedata.YEAR;
      }
      else{
        filterYear = ''
      }
      this.api
        .getallMappedClass(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND CLASS_ID = ' +
            this.data.ID + " "
            + filterYear +
            filterDivision
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Promotestudent = data['data'];
              if (this.Promotestudent.length > 0) {
                this.onAllChecked(true);
              } else {
              }

              this.loadingRecords = false;
            } else {
              this.Promotestudent = [];
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
      this.loadingRecords = false;
      this.Promotestudent = [];
      this.checked = false;
    }
  }
  ChangedYear(data: any) {
    this.loadingRecords = true;
    // console.log(this.data)
    if (data != null && data != undefined && data != '') {
      var filterDivision = '';
      if (this.promotedata.DIVISION_ID) {
        filterDivision = ' AND DIVISION_ID= ' + this.promotedata.DIVISION_ID;
      } else {
        filterDivision = '';
      }
      this.api
        .getallMappedClass(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND CLASS_ID = ' +
            this.data.ID +
            ' AND YEAR_ID = ' +
            data +
            filterDivision
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Promotestudent = data['data'];
              if (this.Promotestudent.length > 0) {
                this.onAllChecked(true);
              } else {
              }

              this.loadingRecords = false;
            } else {
              this.Promotestudent = [];
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
      this.loadingRecords = false;
      this.Promotestudent = [];
      this.checked = false;
    }
  }
  tempdivison: number;
  getYearClassforExcel() {
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', 'AND STATUS!=false ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        } else {
          this.message.error('Failed to Get Year List', `${data.code}`);
        }
      });
    this.api
      .getAllClassMaster(
        0,
        0,
        '',
        '',
        'AND STATUS!=false AND SCHOOL_ID =' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.classlist = data['data'];
        } else {
          this.message.error('Failed to Get Class List', `${data.code}`);
        }
      });
  }

  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;
  SELECTED_RECORDS: number = 0;
  RECORDS: number = 0;

  updateTotalRecords(): void {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }

  onAllChecked(value: boolean): void {
    this.checked = value;
    this.indeterminate = false;

    if (value) {
      this.setOfCheckedId.clear();
      this.Promotestudent.forEach((data) => {
        data.checked = true;
        this.setOfCheckedId.add(data.ID);
      });
    } else {
      this.Promotestudent.forEach((data) => {
        data.checked = false;
      });
      this.setOfCheckedId.clear();
    }

    this.updateTotalRecords();
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.updateTotalRecords();
    this.Promotestudent.forEach((data) => {
      data.checked = this.setOfCheckedId.has(data.ID);
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }

    this.checked = this.Promotestudent.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate = !this.checked && this.setOfCheckedId.size > 0;
  }

  clearselection() {
    this.checked = false;
    this.setOfCheckedId.clear();
    this.SELECTED_RECORDS = 0;
  }
  save(): void {
    this.isOk = true;

    if (
      this.promotedata.YEAR_ID == undefined ||
      this.promotedata.YEAR_ID == null ||
      this.promotedata.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Promote Year', '');
    } else if (
      this.promotedata.CLASS_ID == undefined ||
      this.promotedata.CLASS_ID == null ||
      this.promotedata.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    }
    else if (
      this.tempdivison== undefined ||
      this.tempdivison== null ||
      this.tempdivison<= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    }

    if (this.isOk) {
      const dataToSave = {
        YEAR_ID: this.promotedata.YEAR_ID,
        CLASS_ID: this.promotedata.CLASS_ID,
        DIVISION_ID:this.tempdivison,
        STUDENT_DATA: [],
        SCHOOL_ID: Number(sessionStorage.getItem('schoolid')),
      };
      //

      this.Promotestudent.forEach((student) => {
        if (student.checked) {
          dataToSave.STUDENT_DATA.push(student.STUDENT_ID);
        }
      });

      if (this.Promotestudent.length > 0) {
        this.api.PromoteData(dataToSave).subscribe((data) => {
          if (data['code'] == 200) {
            this.message.success(' Student Promoted successfully...', '');
            this.promoteisSpinning = false;

            this.close();
          } else {
            this.message.error('Student Promotion Failed...', '');
            this.promoteisSpinning = false;
          }
        });
      } else {
        this.message.error('No Student Data For Promote ...', '');
        this.promoteisSpinning = false;
      }
    }
  }

  close(): void {
    this.promotedrawerClose();
  }
}
