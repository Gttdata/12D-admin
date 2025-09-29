import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { Ticketgroup } from 'src/app/pages/Task Management/Models/Ticketgroup';

export class QuestionData {
  AGE_GROUP: any;
  DIAMENTION_ID: number = 0;
  LABEL: any;
  IS_CHILD_AVAILABLE: Boolean = false;
  IS_COMMON: Boolean = false;
  QUESTION_TYPE: number = 0;
  QUESTION_HEAD_ID: number;
  SEQ_NO: number = 0;
  STATUS: boolean = true;
  OPTIONS: any;
  ID: number = 0;
  CLIENT_ID = 1;
}
export class tracktaskmapping {
  ID: any;
  OPTION_ID: number;
  TASK_ID: number;
  TASK_PRIORITY = 'N';
  LABEL: any;
  RANGES: any;
  STATUS: boolean = true;
  DATE_DIFFERENCE: any;
  ENABLE_TIME: any;
  DISABLE_TIME: any;
}

export class innertracktaskmapping {
  TASK_ID: number;
  TASK_PRIORITY = 'N';
  LABEL: any;
  RANGES: any;
  DATE_DIFFERENCE: any;
  ENABLE_TIME: any;
  DISABLE_TIME: any;
}
@Component({
  selector: 'app-trackbookquestionmaster',
  templateUrl: './trackbookquestionmaster.component.html',
  styleUrls: ['./trackbookquestionmaster.component.css'],
})
export class TrackbookquestionmasterComponent implements OnInit {
  formTitle = 'Task Group Master';
  ptionList = [];
  formTitleHead;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  addFirstQuestion = false;
  parentLoading = false;
  departmentLoading = false;
  loadingRecords = false;
  mapTaskVisible = false;
  totalRecords = 1;
  filterQuery = '';
  faqs: any[] = [];
  ticketGroups: Ticketgroup[];
  ticketGroup: Ticketgroup;
  ticketData: Ticketgroup = new Ticketgroup();
  ticketDat2: Ticketgroup = new Ticketgroup();
  isSpinning = false;
  date = new Date();
  Tasklist: any = [];
  date1 = this.datePipe.transform(this.date, 'yyyyMMddHHmmss');
  data2: tracktaskmapping = new tracktaskmapping();
  fileDataLOGO_URL: File = null;
  folderName = 'ticketGroup';
  nodes = [];
  ID: number;
  ticketGroupId: number;
  dataList = [];
  TIMING_TYPE: any = 'Sec';
  TIMING_TYPE1: any = 'Sec';

  columns: string[][] = [
    ['TYPE', 'Type'],
    ['VALUE', 'Value'],
    ['SEQ_NO', 'Sequence No'],
    ['IS_LAST_STATUS', 'Is Last'],
    ['TASK_ASSIGN_TYPE', 'Task Type'],
  ];
  addOptionVisible = false;
  visibleAdd = true;
  NAME: string;
  Question: string;
  applicationId = Number(this.cookie.get('applicationId'));
  ticketId: number;
  name1 = 'None';
  newId = 0;
  loadingRecordsFaqs = false;
  item = {};
  parentId = 0;
  type = '';
  ticketQuestion: Ticketgroup[] = [];
  is_first = 0;
  title = '';
  clickedParentID = 0;
  parentTicketGroups: Ticketgroup[] = [];
  Title = '';
  FAQHead = 0;
  faqdataList = [];

  LoadAgeGroup: boolean = false;
  AgeGroupList: any[];
  Dimensions: [] = [];
  dimensionload: boolean = false;

  constructor(
    private api: ApiService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}
  public commonFunction = new CommomFunctionsService();

  data: QuestionData = new QuestionData();
  ngOnInit() {
    this.data.QUESTION_TYPE = 2;
    let get = 'AND APPLICATION_ID=' + this.applicationId;
    // this.loadTicketGroups(get)
    var filterQuery = '';
    this.loadTicketGroups(filterQuery);
    this.getAgeCateogary();
    this.getallDimensions();

    // console.log(this.nodes, 'nodes');
  }

  getAgeCateogary() {
    this.LoadAgeGroup = true;
    this.api.getAgeCateogary(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.AgeGroupList = data['data'];
          this.LoadAgeGroup = false;
        } else {
          this.AgeGroupList = [];
          this.LoadAgeGroup = false;
        }
      },
      (err) => {
        this.LoadAgeGroup = false;
      }
    );
  }
  getallDimensions() {
    this.dimensionload = false;
    this.api
      .getAllDimensionMaster(0, 0, '', '', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Dimensions = data['data'];
            this.dimensionload = false;
          } else {
            this.Dimensions = [];
            this.dimensionload = false;
          }
        },
        (err) => {
          this.dimensionload = false;
        }
      );
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
  }

  //  Add Button
  addNestedQuestion = false;
  questionId: number;
  disabledFields = false;
  Visible(n) {
    this.isedit = false;
    if (n) {
      this.questionId = n;
      // console.log(n)
      this.addNestedQuestion = true;
      this.addFirstQuestion = true;
      this.disabledFields = true;
      this.Title = 'Add Sub Question';
      this.data = new QuestionData();
      this.api
        .getAllQuestionnariesData(
          1,
          1,
          'SEQ_NO',
          'desc',
          'AND QUESTION_HEAD_ID=0'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['count'] == 0) {
                this.data.SEQ_NO = 1;
              } else {
                this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                this.data.AGE_GROUP = data['data'][0]['AGE_GROUP'];
                this.data.DIAMENTION_ID = data['data'][0]['DIAMENTION_ID'];
                this.disabledFields = true;
              }
            }
          },
          (err) => {}
        );
      // console.log(this.questionId);
    } else {
      this.addNestedQuestion = false;
      this.questionId = this.questionId;
      this.Title = 'Add New Question';
      this.addFirstQuestion = true;
      this.disabledFields = false;
      this.data = new QuestionData();
      this.data2 = new tracktaskmapping();
      this.OptionList = [];
      this.api
        .getAllQuestionnariesData(
          1,
          1,
          'SEQ_NO',
          'desc',
          'AND QUESTION_HEAD_ID=0'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['count'] == 0) {
                this.data.SEQ_NO = 1;
              } else {
                this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
              }
            }
          },
          (err) => {}
        );
    }
    // console.log(n);

    // console.log('Adding New Question');
  }
  isedit = false;
  // Edit
  EditDrawerData(event, index) {
    this.isedit = true;
    console.log(event);
    this.Title = 'Update Question';
    this.questionId = event.key ? event.key : this.questionId;
    if (event.origin.islast) {
      this.isOptionNo = true;
      this.data2.LABEL = 'NO';
    }
    this.api
      .getAllQuestionnariesData(
        0,
        0,
        'ID',
        'DESC',
        ' AND ID=' + (event.key ? event.key : this.data.QUESTION_HEAD_ID)
      )
      .subscribe((questionaryData) => {
        if (questionaryData['code'] === 200) {
          // console.log(questionaryData['data']);
          const questionnaire = questionaryData['data'][0];
          // console.log(questionnaire['ID']);

          if (questionnaire) {
            this.data = Object.assign({}, questionnaire);
            
            console.log(this.data);

            if (this.data.DIAMENTION_ID) {
              this.getAllTasks(this.data.DIAMENTION_ID);
            }

            this.addFirstQuestion = true;
            this.api
              .getAllOptionsData(
                0,
                0,
                'ID',
                'DESC',
                ' AND QUESTION_ID=' + questionnaire['ID'] + ' AND STATUS=1'
              )
              .subscribe((optionData) => {
                if (optionData['code'] === 200) {
                  // console.log(optionData['data']);
                  this.OptionList = optionData['data'];
                  // Process the options data here
                }
              });
          }
        }
      });
    // console.log(this.isOptionNo)
  }

  drawerClose(): void {
    this.is_first = 0;
    this.addFirstQuestion = false;
    this.loadTicketGroups(this.filterQuery);
  }

  OptionList = [];
  index1 = -1;
  OPTION_TEXT: any;
  STATUS: Boolean = false;
  SEQ_NO: any = 1;
  isOptionNo = false;
  // Add this method to your component class
  toggleStatus(node: any): void {
    node.origin.status = !node.origin.status;
    // console.log(node)
    // console.log(this.data)
    this.questionId = node.key ? node.key : this.questionId;
    this.data.ID = this.questionId;
    this.data.STATUS = node.origin.status;

    // if (this.data.ID) {
    this.api.updateQuestionMasterTask(this.data).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        // TrackbookQuestion.form.reset();
        // Add your update message here
        this.isSpinning = false;
      }
    });
    // }
    // Any additional logic when toggling the status
  }

  viewTask(isNo: boolean) {
    // this.data2 = new tracktaskmapping();
    // this.data3.TASK_PRIORITY = 'N';
    this.TaskArrayData = [];
    if (!isNo) {
      if (
        (this.data.QUESTION_TYPE <= 0 ||
          this.data.QUESTION_TYPE == null ||
          this.data.QUESTION_TYPE == undefined) &&
        this.data.IS_COMMON
      ) {
        this.message.error(' Please First Select Question Type  ', '');
        this.mapTaskVisible = false;
        this.isOptionNo = false;
      } else {
        this.mapTaskVisible = true;
        this.data2 = new tracktaskmapping();
        // if (this.data.IS_CHILD_AVAILABLE) {
        //   this.data2.LABEL = 'NO';
        //   this.isOptionNo=true
        //   // this.mapTaskVisible = true;
        // }
        this.index1 = -1;
      }
    } else {
      this.mapTaskVisible = true;
      this.isOptionNo = isNo;
    }
  }
  addNooption() {
    if (this.data.IS_CHILD_AVAILABLE) {
      this.data2.LABEL = 'NO';
      this.isOptionNo = true;
      this.AddOptionNovisible = true;
    }
    // this.index1 = -1;
  }
  isChildAvail(data) {
    if (data) {
      this.data.QUESTION_TYPE = 0;
      this.data.OPTIONS = [];
      this.OptionList = [];
      this.data2.LABEL = 'NO';
    }
  }
  abc(data) {
    // console.log(data);
    if (this.data.QUESTION_TYPE != undefined) {
      this.OptionList = [];
    } else {
    }
  }
  getRangeValues(): number[] {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }

  getColorClass(number: number, range: string): string {
    if (!range) return 'grey';

    const [start, end] = range.split('-').map(Number);
    if (number >= start && number <= end) {
      return 'yellow';
    } else {
      return 'grey';
    }
  }

  isInRange(number: number, range: string): boolean {
    if (!range) return false;

    const [start, end] = range.split('-').map(Number);
    return number >= start && number <= end;
  }

  onRangeChange(value: any) {
    // console.log('Range changed:', value);
    // You can add additional logic here if needed
  }

  INNERTABLEDATA: any = new tracktaskmapping();
  data3: innertracktaskmapping = new innertracktaskmapping();

  TaskArrayData: any = [];
  dupplicate = true;
  index = -1;
  totaldata = 1;

  addData(addNew: boolean, form2: NgForm) {
    // console.log(form2.form.value);

    var isOK = true;
    this.isSpinning = false;
    if (
      this.data2.LABEL == undefined &&
      this.data3.TASK_ID == undefined &&
      this.data3.ENABLE_TIME == undefined &&
      this.data3.DISABLE_TIME == undefined &&
      this.data3.DATE_DIFFERENCE == undefined
    ) {
      isOK = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      (this.data2.LABEL == undefined ||
        this.data2.LABEL == null ||
        this.data2.LABEL <= 0) &&
      this.data.QUESTION_TYPE !== 3
    ) {
      isOK = false;
      this.message.error(' Please Enter Option  ', '');
    } else if (
      this.data3.TASK_ID == undefined ||
      this.data3.TASK_ID == null ||
      this.data3.TASK_ID < 0
    ) {
      isOK = false;
      this.message.error(' Please Select Task  ', '');
    } else if (
      (this.data3.ENABLE_TIME == undefined || this.data3.ENABLE_TIME == null) &&
      this.data3.TASK_ID != 0
    ) {
      isOK = false;
      this.message.error(' Please Enter Enable Time  ', '');
    } else if (
      (this.data3.DISABLE_TIME == undefined ||
        this.data3.DISABLE_TIME == null) &&
      this.data3.TASK_ID != 0
    ) {
      isOK = false;
      this.message.error(' Please Enter Disable Time  ', '');
    } else if (
      (this.data3.DISABLE_TIME != null ||
        this.data3.DISABLE_TIME != undefined) &&
      (this.data3.ENABLE_TIME != null || this.data3.ENABLE_TIME == undefined) &&
      this.data3.ENABLE_TIME &&
      this.data3.DISABLE_TIME <= this.data3.ENABLE_TIME
    ) {
      isOK = false;
      this.message.error(
        ' Disable time should be greater than Enable time',
        ''
      );
    } else if (
      (this.data3.DATE_DIFFERENCE == undefined ||
        this.data3.DATE_DIFFERENCE == null ||
        this.data3.DATE_DIFFERENCE == '') &&
      this.data3.TASK_ID != 0
    ) {
      isOK = false;
      this.message.error(' Please Enter Date Difference  ', '');
    }

    this.dupplicate = true;
    if (isOK) {
      // Uncomment the following block if you need to check for duplicate signatures
      // if (this.TaskArrayData.length > 0) {
      //   for (let i = 0; i < this.TaskArrayData.length; i++) {
      //     if (this.data3.TASK_ID == this.TaskArrayData[i].TASK_ID) {
      //       this.message.warning('Task Already Mapped ', '');
      //       this.dupplicate = false;
      //     } else {
      //     }
      //   }
      // }
    }

    if (this.dupplicate && isOK) {
      if (this.data3.DISABLE_TIME && this.data3.ENABLE_TIME) {
        this.data3.DISABLE_TIME = this.datePipe.transform(
          this.data3.DISABLE_TIME,
          'HH:mm:ss'
        );
        this.data3.ENABLE_TIME = this.datePipe.transform(
          this.data3.ENABLE_TIME,
          'HH:mm:ss'
        );
      }
      this.INNERTABLEDATA = {
        TASK_ID: this.data3.TASK_ID,
        ENABLE_TIME: this.data3.ENABLE_TIME,
        DISABLE_TIME: this.data3.DISABLE_TIME,
        DATE_DIFFERENCE: this.data3.DATE_DIFFERENCE,
        TASK_PRIORITY: this.data3.TASK_PRIORITY,
        // Add other fields as necessary
      };

      if (this.index > -1) {
        this.TaskArrayData[this.index] = this.INNERTABLEDATA;
      } else {
        this.TaskArrayData.push(this.INNERTABLEDATA);
      }

      this.TaskArrayData = [...this.TaskArrayData];

      console.log(this.TaskArrayData);

      this.index = -1;
      this.totaldata = this.TaskArrayData.length;
      // form2.form.reset();
      this.data3 = new innertracktaskmapping();
      // this.data2.LABEL=''
      form2.form.markAsUntouched();
      form2.form.markAsPristine();
    }
  }

  delete2(data: any, index: number): void {
    console.log(this.TaskArrayData, data);
    this.TaskArrayData.splice(index, 1);
    this.TaskArrayData = [...[], ...this.TaskArrayData];
  }
  isOk = true;
  mergeAndSaveMapping(innertaskform: NgForm) {
    // console.log('Called');

    // this.isSpinning = true;
    // console.log(this.data2, innertaskform.form.value);
    this.isOk = true;

    if (this.TaskArrayData.length <= 0) {
      this.isOk = false;
      this.message.error('Please Add Task', '');
      this.mapTaskVisible = true;
    }

    var newitem;

    if (this.isOk) {
      if (this.data.QUESTION_TYPE === 3) {
        this.data2.RANGES = this.data2.RANGES;
        this.data2.LABEL = '';
        this.data2.RANGES = this.data2.RANGES.join(' - ');
      } else {
        this.data2.LABEL = this.data2.LABEL;
        this.data2.RANGES = '';
      }

      if (this.index1 > -1) {
        this.data2['LABEL'] = this.data2.LABEL;
        this.data2['STATUS'] = this.data2.STATUS;

        this.index1 = -1;
      } else {
        if (this.data2.LABEL || this.data2.RANGES) {
          // Increment ID for each new item
          // console.log(this.TaskArrayData)
          const newItem = {
            // QUESTION_ID: this.OptionList.length + 1, // Increment ID
            ID: this.data2.ID,
            OPTION_ID: this.data2.OPTION_ID,
            CLIENT_ID: this.data.CLIENT_ID,
            QUESTION_ID: this.questionId,
            LABEL: this.data2.LABEL,
            RANGES: this.data2.RANGES,
            STATUS: this.data2.STATUS,
            TASKS: this.TaskArrayData,
          };
          newitem = newItem;

          this.OptionList = [...this.OptionList, newItem];
        }

        if (!this.isOptionNo) {
          this.data2 = new tracktaskmapping();
        }
      }
      if (this.data.ID) {
        this.api.optionsAddonEdit(newitem).subscribe((data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            this.mapTaskVisible = false;
            this.TaskArrayData = [];
            this.data3 = new innertracktaskmapping();
            this.data2 = new tracktaskmapping();

            this.message.success('Options Mapped Successfuly', '');
          } else {
            this.isSpinning = false;
            this.message.error('Options Mapping Failed', '');
          }
        });
      }
    }
    if (this.TaskArrayData.length > 0) {
      this.mapTaskVisible = false;
    }
    // console.log(this.OptionList);
  }

  editRow(data, index) {
    this.index1 = index;
    this.data2 = Object.assign({}, data);
    this.mapTaskVisible = true;
  }
  mergeDeletedOption: any = [];
  // deleteddata: any = [];
  delete(data1, id: number): void {
    // Check if the id is within the valid range
    console.log(data1)
    if (id >= 0 && id < this.OptionList.length) {
        // Change the STATUS of the item to 0
        this.OptionList[id].STATUS = 0;

        // If you need to send this change to the server
        if (this.isedit) {
            this.api.deleteOptiondata(this.OptionList[id]).subscribe((data) => {
                if (data['code'] == 200) {
                    this.message.success('Deletion Successfully', '');
                } else {
                    this.message.error('Deletion Failed', '');
                }
            });
        }
    } else {
        // Handle case when id is not in the valid range (optional)
        // console.log('Item not found in OptionList');
    }
}


  maptasks: [] = [];
  maptasksload: boolean = false;
  getAllTasks(data) {
    if (this.data.DIAMENTION_ID != null) {
      // this.data.DIAMENTION_ID = 0;
    }
    this.maptasksload = true;

    if (data != null && data != undefined) {
      this.api
        .getAllTrackBookTasks(
          0,
          0,
          '',
          '',
          ' AND DIAMENTION_ID=' + data + " AND TYPE='T'"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.maptasks = data['data'];
              // console.log(this.maptasks);

              this.maptasksload = false;
            } else {
              this.maptasks = [];
              this.maptasksload = false;
            }
          },
          (err) => {
            this.maptasksload = false;
          }
        );
    }
  }
  selectedRatings: string = '';

  updateSelectedRatings(value: number): void {
    // Convert the selected number to a string and append it to the existing selectedRatings
    this.selectedRatings += value.toString() + ',';
    // console.log('Selected Ratings:', this.selectedRatings);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose1(): void {
    this.addOptionVisible = false;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  drawerClose2(): void {
    this.mapTaskVisible = false;
    // this.data2 = new tracktaskmapping();
    this.TaskArrayData = [];
    // this.data2.RANGES=null
    this.loadTicketGroups(this.filterQuery);
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }
  AddOptionNovisible = false;
  drawerClose3(): void {
    this.AddOptionNovisible = false;
    this.loadTicketGroups(this.filterQuery);
  }

  // get closeCallback3() {
  //   return this.drawerClose2.bind(this);
  // }
  loadTicketGroups(filter?) {
    this.loadingRecords = true;
    this.parentLoading = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      filter = likeQuery;
    }

    this.dataList = [];
    this.ticketDat2 = new Ticketgroup();

    this.api
      .getAllQuestionnariesData(0, 0, '', '', ' AND QUESTION_HEAD_ID=0')
      .subscribe(
        (Questiondata) => {
          // console.log(Questiondata, 'Data getAllQuestionnariesData');

          if (Questiondata['count'] != 0) {
            // console.log(Questiondata, 'Questiondata');

            this.ticketDat2 = Object.assign({}, Questiondata['data'][0]);
            this.ticketId = this.ticketDat2.ID;
            // console.log(this.ticketDat2, this.ticketId);

            this.nodes = Questiondata['data'].map((question) => {
              return {
                title: question['LABEL'],
                key: question['ID'],
                islast: question['IS_CHILD_AVAILABLE'],
                // isChildAvailable: question['IS_CHILD_AVAILABLE'],
                isParent: true,
                color: '#ff5d74',
                status: question['STATUS'],
              };
            });
            // console.log(Questiondata['data'], 'nodes');

            this.loadingRecords = false;
          } else {
            this.ticketDat2 = new Ticketgroup();
            this.loadingRecords = false;
          }

          this.parentLoading = false;
        },
        (err) => {
          this.loadingRecords = false;
          this.parentLoading = false;
        }
      );
  }

  loadTicketGroups2(filter?) {
    this.loadingRecords = true;
    this.parentLoading = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      //console.log("likeQuery" + likeQuery);
      filter = likeQuery;
    }

    this.ticketGroups = [];
    this.ticketQuestion = [];
    this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filter).subscribe(
      (ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          if (ticketGroups['count'] == 0) {
            this.totalRecords = 0;
            this.loadingRecords = false;
          } else {
            this.ticketQuestion = ticketGroups['data'].filter(
              (item) => item.TYPE == 'Q'
            );
            this.ticketGroups = ticketGroups['data'].filter(
              (item) => item.TYPE == 'O'
            );
            this.totalRecords = ticketGroups['count'];
            this.loadingRecords = false;
          }
        }
      },
      (err) => {
        this.loadingRecords = false;
        this.message.error(JSON.stringify(err), '');
      }
    );
  }

  save(addNew: boolean, TrackbookQuestion: NgForm) {
    var isok = true;
    // console.log(this.mergeDeletedOption);
    // if (this.mergeDeletedOption) {
    //   // this.mergeDeletedOption = this.mergeDeletedOption.map((data) => {
    //   //   data.STATUS = 0;
    //   // });
    //   this.OptionList.push(...this.mergeDeletedOption);
    // }
    this.data.OPTIONS = this.OptionList;

    // console.log(this.data);

    if (
      (this.data.AGE_GROUP == undefined ||
        this.data.AGE_GROUP == null ||
        this.data.AGE_GROUP <= 0) &&
      (this.data.DIAMENTION_ID <= 0 ||
        this.data.DIAMENTION_ID == null ||
        this.data.DIAMENTION_ID == undefined) &&
      (this.data.LABEL == '' ||
        this.data.LABEL == null ||
        this.data.LABEL == undefined) &&
      (this.data.SEQ_NO <= 0 ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO == undefined)
    ) {
      isok = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.AGE_GROUP == undefined ||
      this.data.AGE_GROUP == null ||
      this.data.AGE_GROUP <= 0
    ) {
      isok = false;
      this.message.error(' Please Select Age Group ', '');
    } else if (
      this.data.DIAMENTION_ID <= 0 ||
      this.data.DIAMENTION_ID == null ||
      this.data.DIAMENTION_ID == undefined
    ) {
      isok = false;
      this.message.error(' Please Select Dimension ', '');
    } else if (
      this.data.LABEL == '' ||
      this.data.LABEL == null ||
      this.data.LABEL == undefined
    ) {
      isok = false;
      this.message.error(' Please Enter Label ', '');
    } else if (
      (this.data.QUESTION_TYPE <= 0 ||
        this.data.QUESTION_TYPE == null ||
        this.data.QUESTION_TYPE == undefined) &&
      !this.data.IS_CHILD_AVAILABLE
    ) {
      isok = false;
      this.message.error(' Please Select Question Type ', '');
    } else if (
      this.data.SEQ_NO == undefined ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO <= 0
    ) {
      isok = false;
      this.message.error(' Please Enter Sequence Number ', '');
    } else if (this.data.OPTIONS.length <= 0 && !this.data.IS_CHILD_AVAILABLE) {
      isok = false;
      this.message.error(' Please Map Options ', '');
    }

    // console.log(this.data, ' Data to Be Added');

    if (isok) {
      if (this.data.IS_CHILD_AVAILABLE) {
        this.data.QUESTION_TYPE = 0;
        this.data.OPTIONS = [];
      }

      this.data.QUESTION_TYPE = Number(this.data.QUESTION_TYPE);
      // this.data.QUESTION_HEAD_ID = this.questionId?this.questionId:0;
      this.isSpinning = true;
      if (this.data.ID) {
        this.api
          .updateQuestionMasterTask(this.data)
          .subscribe((successCode) => {
            if (successCode['code'] == '200') {
              TrackbookQuestion.form.reset();
              this.close2();
              this.isSpinning = false;
              // Add your update message here
              this.message.info(
                'Trackbook Question updated successfully...',
                ''
              );
            } else {
              this.message.error(
                'Failed to update Trackbook Question information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      } else {
        if (this.addNestedQuestion && this.questionId) {
          this.data.QUESTION_HEAD_ID = this.questionId ? this.questionId : 0;
          console.log('Question Nested');
        } else {
          this.data.QUESTION_HEAD_ID = 0;
        }
        this.api
          .createQuestionMasterTask(this.data)
          .subscribe((successCode) => {
            if (successCode['code'] == '200') {
              // console.log(addNew, 'addnew');

              if (!addNew) {
                TrackbookQuestion.form.reset();
                this.close2();
              } else {
                // this.ticketData = new Ticketgroup();
              }
              this.isSpinning = false;
              this.message.info('New  Question created successfully...', '');
            } else {
              this.message.error('Failed to add  Question Data...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  close(TrackbookQuestion: NgForm) {
    TrackbookQuestion.form.reset();
    this.addFirstQuestion = false;
  }
  close2() {
    this.addFirstQuestion = false;
    this.filterQuery = '';
    this.loadTicketGroups(this.filterQuery);
    this.OptionList = [];
  }
  childAvailable = 1;
  nzEvent(event) {
    // console.log(event);
    // if(!this.childAvailable){
    //   this.childAvailable=1
    // }
    this.api
      .getAllQuestionnariesData(0, 0, '', '', 'AND ID=' + event['node']['key'])
      .subscribe((dataa2) => {
        if (dataa2['code'] == 200 && dataa2['count'] > 0) {
          this.childAvailable = dataa2['data'][0]['IS_CHILD_AVAILABLE'];
          // console.log(dataa2['data'][0]);ks
          // console.log(event['node']);
        }
        if (event['eventName'] == 'expand') {
          let node = event['node'];
          // let isChildAvailable=0
          // if(node.level==0){
          //   this.childAvailable=1
          // }
          // else if(node.level>=2){
          //   this.childAvailable=0
          // }

          if (node['key'] != undefined) {
            if (this.childAvailable == 1) {
              this.api
                .getAllQuestionnariesData(
                  0,
                  0,
                  '',
                  '',
                  'AND QUESTION_HEAD_ID=' + node['key']
                )
                .subscribe((dataa) => {
                  const data = dataa['data'];
                  if (dataa['count'] > 0) {
                    node.clearChildren();
                    const childrens = [];
                    for (let index = 0; index < dataa['count']; index++) {
                      const label = data[index]['LABEL'];
                      // const ranges = data[index]['RANGES'];

                      // console.log(label, ' ', ranges);

                      childrens.push({
                        title: label,
                        key: data[index]['ID'],
                        islast: node.origin.islast,
                        // isLeaf: true,
                        // childAvailable: node.origin.islast,
                        isParent: true,
                        color: '#ff5d74',
                        status: data[index]['STATUS'],
                      });

                      // console.log(childrens);
                    }
                    node.addChildren(childrens);
                    // console.log(dataa['data'][0]);
                  } else {
                    this.message.info('No any Child', '');
                  }
                });
            } else if (this.childAvailable == 0) {
              this.filterQuery =
                'AND QUESTION_ID=' + node['key'] + ' AND STATUS=1';
              this.api
                .getAllOptionsData(0, 0, '', '', this.filterQuery)
                .subscribe((ticketGroups) => {
                  const data = ticketGroups['data'];
                  if (ticketGroups['count'] > 0) {
                    node.clearChildren();
                    const childrens = [];
                    for (
                      let index = 0;
                      index < ticketGroups['count'];
                      index++
                    ) {
                      const label = data[index]['LABEL'];
                      const ranges = data[index]['RANGES'];

                      // console.log(label, ' ', ranges);

                      childrens.push({
                        title:
                          label !== null && label !== undefined && label !== ''
                            ? label
                            : ranges,
                        key: data[index]['QUESTION_ID'],
                        islast: false,
                        isLeaf: true,
                        // childAvailable: node.origin.islast,
                        color: '#0097d3',
                        status: data[index]['STATUS'],
                      });

                      // console.log(childrens);
                    }
                    node.addChildren(childrens);
                  } else {
                    this.message.info('No any Child', '');
                  }
                });
            }
            // console.log(this.childAvailable);
          }
        }
        // else{
        //   this.childAvailable=1
        // }
      });
  }

  add() {
    // console.log(this.addFirstQuestion);

    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.Question_Head_ID = this.ID;
    var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
    this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery).subscribe(
      (ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          this.parentTicketGroups = ticketGroups['data'];
        }
        this.addFirstQuestion = true;
        this.loadingRecords = false;
      },
      (err) => {
        this.loadingRecords = false;
        this.message.error(JSON.stringify(err), '');
      }
    );
  }

  add2(event, type, node) {
    // console.log(node, type, event);
    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.Question_Head_ID = Number(node.origin.key);
    this.ticketData.TYPE = type;
    this.ticketData.STATUS = true;
    this.clickedParentID = node.origin.parentID;
    this.ID = Number(node.origin.key);
    this.Title = type == 'O' ? 'Add New Option' : 'Add New Question';
    this.filterQuery = 'AND PARENT_ID=' + node.origin['key'];

    if (type == 'Q') {
      this.api
        .getAllTicketGroups(0, 0, '', '', this.filterQuery)
        .subscribe((ticketGroups) => {
          if (ticketGroups['count'] > 0) {
            this.message.info('You can add only one question to options.', '');
          } else {
            var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
            this.api
              .getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery)
              .subscribe(
                (ticketGroups) => {
                  if (ticketGroups['code'] == 200) {
                    this.parentTicketGroups = ticketGroups['data'];
                  }
                  this.addFirstQuestion = true;
                  this.loadingRecords = false;
                },
                (err) => {
                  this.loadingRecords = false;
                  this.message.error(JSON.stringify(err), '');
                }
              );
          }
        });
    } else {
      var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
      this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery).subscribe(
        (ticketGroups) => {
          if (ticketGroups['code'] == 200) {
            this.parentTicketGroups = ticketGroups['data'];
          }
          this.addFirstQuestion = true;
          this.loadingRecords = false;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error(JSON.stringify(err), '');
        }
      );

      this.api
        .getAllTicketGroups(0, 0, 'SEQ_NO', 'DESC', ' AND PARENT_ID=' + this.ID)
        .subscribe(
          (ticketGroups2) => {
            if (ticketGroups2['code'] == 200) {
              if (ticketGroups2['data'].length == 0) {
                this.ticketData.SEQ_NO = 1;
              } else {
                this.ticketData.SEQ_NO =
                  Number(ticketGroups2['data'][0]['SEQ_NO']) + 1;
              }
            }
          },
          (err) => {}
        );
    }
  }

  clearData() {
    this.ticketData.ID = undefined;
    this.ticketData.VALUE = '';
    this.ticketData.SEQ_NO = 0;
    this.ticketData.TASK_ASSIGN_TYPE = 'D';
    this.ticketData.DESCRIPTION = '';
  }

  closeMapTask() {
    this.TaskArrayData = [];
    this.mapTaskVisible = false;
  }
}
