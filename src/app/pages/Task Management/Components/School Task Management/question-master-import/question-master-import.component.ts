import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';

export class Questions {
  ID: number;
  DIRECTION: any;
  DESCRIPTION: string;
  QUESTION: string;
  ANSWER: any;
  OPTION_A: string;
  OPTION_B: string;
  OPTION_C: string;
  OPTION_D: string;
  OPTION_E: string;
  CLIENT_ID: any;
}
class QuestionDataModal {
  CHAPTER_ID: number;
  SUBJECT_ID: number;
  CLASS_ID: number;
  MEDIUM_ID: number;
  QUESTION_TYPE: any = 0;
  QUESTION_IMAGE: string;
  ANSWER_IMAGE: string;
  ANSWER: string;
  MARKS: any;
  OPTIONS: any[];
  STATUS: boolean = true;
  SEQ_NO: number;
  DIRECTION: string;
  QUESTION: string;
  DESCRIPTION: string;
  CLIENT_ID: any;
}

@Component({
  selector: 'app-question-master-import',
  templateUrl: './question-master-import.component.html',
  styleUrls: ['./question-master-import.component.css'],
})
export class QuestionMasterImportComponent implements OnInit {
  Classes: any[] = [];
  classload: boolean = false;
  subjects: [] = [];
  subjectsload: boolean = false;
  questionTypeList: any[];
  typeLoad: boolean;
  chapterList: any[];
  chapterLoad: boolean;
  Mediumlist: any = [];
  dataQuestion1: QuestionDataModal = new QuestionDataModal();
  roleId: any;
  Descriptive = false;
  formTitle = 'Question Importer';
  filetxt: File = null;
  loadingRecords = false;

  constructor(public api: ApiService, private message: NzNotificationService) {}
  fileContent: string = '';
  levels: any;
  questionData = [];
  allquestionData = [];
  finalJSON = [];
  finalJSON1 = [];
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  isSaveSpinning = false;
  diabledButton = true;
  logtext: string = '';
  isokfile = true;
  id: number;
  chapters = [];
  title = 'done';
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;

  ngOnInit() {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.getAllClasses();
    this.GetMediumData();
    this.getallQuestionType();
  }

  getAllClasses() {
    this.classload = true;
    this.api
      .getAllQuestionPaperClassMaster(0, 0, '', '', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataQuestion1.CLASS_ID = Number(
              sessionStorage.getItem('classid')
            );
            this.Classes = data['data'];
            this.classload = false;
          } else {
            this.Classes = [];
            this.classload = false;
          }
        },
        (err) => {
          this.classload = false;
        }
      );
  }
  subjectData(event) {
    

    if (event != null && event !== undefined && event != '') {
      this.dataQuestion1.SUBJECT_ID = null;
      this.dataQuestion1.CHAPTER_ID = null;
      this.subjectsload = true;
      this.api
        .getAllQuestionSubject(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false' + ' AND CLASS_ID = ' + event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.subjects = data['data'];
              this.subjectsload = false;
            } else {
              this.subjects = [];
              this.subjectsload = false;
            }
          },
          (err) => {
            this.subjectsload = false;
          }
        );
    } else {
      this.subjects = [];
      this.subjectsload = false;
      this.dataQuestion1.SUBJECT_ID = null;
      this.dataQuestion1.CHAPTER_ID = null;
    }
  }
  getallChapter(event) {
    if (this.dataQuestion1.CHAPTER_ID != null) {
      this.dataQuestion1.CHAPTER_ID = 0;
    } else {
    }
    if (event != null && event !== undefined && event != '') {
      this.dataQuestion1.CHAPTER_ID = null;
      this.chapterLoad = true;
      this.api
        .getAllChapterMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false  AND SUBJECT_ID = ' + event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.chapterList = data['data'];
              this.chapterLoad = false;
            } else {
              this.chapterList = [];
              this.chapterLoad = false;
            }
          },
          (err) => {
            this.chapterLoad = false;
          }
        );
    } else {
      this.chapterList = [];
      this.chapterLoad = false;
      this.dataQuestion1.CHAPTER_ID = null;
    }
  }
  getallQuestionType() {
    this.typeLoad = true;
    this.api.getAllQuestionType(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.questionTypeList = data['data'];
          this.typeLoad = false;
        } else {
          this.questionTypeList = [];
          this.typeLoad = false;
        }
      },
      (err) => {
        this.typeLoad = false;
      }
    );
  }
  GetMediumData() {
    this.api
      .getAllBoardMediumMaster(0, 0, '', 'asc', ' AND STATUS=1 ')
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

  ChangeData: any = 0;
  DataChange(data) {
    

    this.ChangeData = data;
    this.allquestionData = [];
    this.selectedFileName = null;
    // this.diabledButton = true
  }

  // File Selected

  selectedFileName: string = '';

  // onFileSelectedTXT(fileList: FileList) {
  //   
    
  //   this.filetxt = null;
  //   var isOk = true;
  //   // if (this.ChangeData == 0) {

  //   //   isOk = false
  //   //   this.selectedFileName = ''
  //   //   this.message.error('Please Select Question Type', '')

  //   // }

  //   if (isOk) {
  //     this.isokfile = true;
  //     const allowed_types = ['text/plain'];
  //     if (!allowed_types.toString().match(fileList[0].type)) {
  //       this.isokfile = false;
  //       this.message.error('Only Text File are allowed ( .txt)', '');
  //     }

  //     if (this.isokfile) {
  //       this.filetxt = fileList[0];
  //       this.selectedFileName = fileList[0].name;
  //       this.diabledButton = false;
  //     }
  //   }
  // }

  onFileSelectedTXT(fileList: FileList) {
    
  
    this.filetxt = null;
    let isOk = true;
  
    if (fileList.length > 0 && this.ChangeData <= 0) {
      isOk = false;
      this.selectedFileName = '';
      this.message.error('Please Select Question Type', '');
    }
  
    if (isOk) {
      this.isokfile = true;
      const allowed_types = ['text/plain'];
      if (!allowed_types.includes(fileList[0].type)) {
        this.isokfile = false;
        this.message.error('Only Text File are allowed (.txt)', '');
      }
  
      if (this.isokfile) {
        this.filetxt = fileList[0];
        this.selectedFileName = fileList[0].name;
        this.diabledButton = false; 
      }
    }
  }
  
  extract1() {
    
    this.loadingRecords = true;

    if (this.ChangeData == 1) {
      if (!this.filetxt) {
        this.message.error('Please Select File...', '');
        return;
      }

      this.Descriptive = false;
      this.questionData = [];
      let fileData = '';
      let fileReader: FileReader = new FileReader();
      let self = this;

      fileReader.onloadend = function () {
        self.fileContent = fileReader.result as string;
        fileData = self.fileContent;

        

        fileData = fileData
          .replace(/\\r|\\n|\\t/g, '')
          .replace(/\\/g, '&#92;')
          .replace(/\\"/g, '&#34;')
          .replace(/\\'/g, '&#39;')
          .replace(/\[|\]/g, (m) => (m === '[' ? '&#91;' : '&#93;'));

        let counter = 2;
        while (fileData != '') {
          let questionObject: Questions = new Questions();
          let all = '';
          let answer = '';
          let tempIndex = 0;
          let id = (counter - 1).toString();

          if (fileData.indexOf('(' + counter + ')') > 0) {
            tempIndex = fileData.indexOf(')') + 1;
            all = fileData.substring(
              tempIndex,
              fileData.indexOf('(' + counter + ')') - tempIndex + tempIndex
            );
            if (counter >= 10) fileData = fileData.substring(all.length + 4);
            else fileData = fileData.substring(all.length + 3);
          } else {
            all = fileData.substring(fileData.indexOf(')') + 1);
            fileData = '';
          }

          if (all.indexOf('*(a)') > 0) {
            answer = 'A';
          } else if (all.indexOf('*(b)') > 0) answer = 'B';
          else if (all.indexOf('*(c)') > 0) answer = 'C';
          else if (all.indexOf('*(d)') > 0) answer = 'D';
          else if (all.indexOf('*(e)') > 0) answer = 'E';

          let indexOfA =
            answer == 'A' ? all.indexOf('*(a)') : all.indexOf('(a)');
          let indexOfB =
            answer == 'B' ? all.indexOf('*(b)') : all.indexOf('(b)');
          let indexOfC =
            answer == 'C' ? all.indexOf('*(c)') : all.indexOf('(c)');
          let indexOfD =
            answer == 'D' ? all.indexOf('*(d)') : all.indexOf('(d)');
          let indexOfE =
            answer == 'E' ? all.indexOf('*(e)') : all.indexOf('(e)');
          let indexOfDirection = all.indexOf('$#direction');
          let indexOfDescription = all.indexOf('$#description');

          let question = '';
          let optionA = '';
          let optionB = '';
          let optionC = '';
          let optionD = '';
          let optionE = '';
          let direction = '';
          let description = '';

          if (
            indexOfE == -1 &&
            indexOfDirection == -1 &&
            indexOfDescription == -1
          ) {
            //only 4 options
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            optionD = all.substring(all.indexOf('(d)') + 3);
            counter = counter + 1;
          } else if (indexOfDirection == -1 && indexOfDescription == -1) {
            // only 5 options
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(d)') + 3;
            optionD = all.substring(
              tempIndex,
              indexOfE - tempIndex + tempIndex
            );
            optionE = all.substring(all.indexOf('(e)') + 3);
            counter = counter + 1;
          } else if (indexOfE == -1 && indexOfDescription == -1) {
            //only 4 options and direction present
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(d)') + 3;
            optionD = all.substring(
              tempIndex,
              indexOfDirection - tempIndex + tempIndex
            );
            direction = all.substring(all.indexOf('$#direction') + 11);
            counter = counter + 1;
          } else if (indexOfE == -1 && indexOfDirection == -1) {
            // only 4 options and description present
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(d)') + 3;
            optionD = all.substring(
              tempIndex,
              indexOfDescription - tempIndex + tempIndex
            );
            description = all.substring(all.indexOf('$#description') + 13);
            counter = counter + 1;
          } else if (indexOfE == -1) {
            // 4 options and direction and description present
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(d)') + 3;
            optionD = all.substring(
              tempIndex,
              indexOfDirection - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('$#direction') + 11;
            direction = all.substring(
              tempIndex,
              indexOfDescription - tempIndex + tempIndex
            );
            description = all.substring(all.indexOf('$#description') + 13);
            counter = counter + 1;
          } // all are present
          else {
            tempIndex = 0;
            question = all.substring(tempIndex, indexOfA - tempIndex);
            tempIndex = all.indexOf('(a)') + 3;
            optionA = all.substring(
              tempIndex,
              indexOfB - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(b)') + 3;
            optionB = all.substring(
              tempIndex,
              indexOfC - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(c)') + 3;
            optionC = all.substring(
              tempIndex,
              indexOfD - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(d)') + 3;
            optionD = all.substring(
              tempIndex,
              indexOfE - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('(e)') + 3;
            optionE = all.substring(
              tempIndex,
              indexOfDirection - tempIndex + tempIndex
            );
            tempIndex = all.indexOf('$#direction') + 11;
            direction = all.substring(
              tempIndex,
              indexOfDescription - tempIndex + tempIndex
            );

            description = all.substring(all.indexOf('$#description') + 13);

            counter = counter + 1;
          }

          questionObject.ID = counter - 2;
          questionObject.DIRECTION = direction.trim();
          questionObject.DESCRIPTION = description.trim();
          questionObject.QUESTION = question.trim();
          questionObject.OPTION_A = optionA.trim();
          questionObject.OPTION_B = optionB.trim();
          questionObject.OPTION_C = optionC.trim();
          questionObject.OPTION_D = optionD.trim();
          questionObject.OPTION_E = optionE.trim();
          questionObject.ANSWER = answer;
          questionObject.CLIENT_ID = self.api.clientId;
          questionObject = Object.assign({}, questionObject);
          self.questionData.push(questionObject);
          self.allquestionData = self.questionData;
        }
      };
      fileReader.readAsText(this.filetxt);
      this.loadingRecords = false;
    } else {
      if (!this.filetxt) {
        this.message.error('Please Select File...', '');
        return;
      }

      this.Descriptive = true;
      this.questionData = [];
      let fileData = '';
      let fileReader: FileReader = new FileReader();
      let self = this;

      fileReader.onloadend = function () {
        self.fileContent = fileReader.result as string;
        fileData = self.fileContent;
        fileData = fileData
          .replace(/\\r|\\n|\\t/g, '')
          .replace(/\\/g, '&#92;')
          .replace(/\\"/g, '&#34;')
          .replace(/\\'/g, '&#39;')
          .replace(/\[|\]/g, (m) => (m === '[' ? '&#91;' : '&#93;'));

        const questions = fileData.split(/\(\d+\)/).filter(Boolean);
        questions.forEach((question, index) => {
          let questionObject: Questions = new Questions();
          // const matchDescription = question.match(/Answer:\s*\w+([\s\S]+?)(?=\(\d+\)|$)/);
          const matchDescription = question.match(/Answer:(.*?)(?=\n\s*\n|$)/s);

          const matchQuestion = question.match(
            /(.+)\?[\n\r\s]*Answer:\s*(\w+)/
          );

          if (matchQuestion) {
            questionObject.QUESTION = matchQuestion[1].trim() + '?';
            questionObject.ANSWER = matchDescription[1].trim();

          }

          if (fileData.includes('$#direction')) {
            questionObject.DIRECTION = fileData.indexOf('$#direction') + 11;
          }
          if (fileData.includes('$#description')) {
            questionObject.DESCRIPTION = fileData.substring(
              fileData.indexOf('$#description') + 13
            );
          }
          questionObject.ID = index + 1;
          self.questionData.push(questionObject);
        });

        self.allquestionData = self.questionData;
      };
      fileReader.readAsText(this.filetxt);
    }
    this.loadingRecords = false;
  }

  deleteRow(data) {
    const index = this.allquestionData.indexOf(data);
    this.allquestionData.splice(index, 1);
    this.allquestionData = this.allquestionData.filter((object) => {
      return object['ID'] != data;
    });
  }

  save(questionpage: NgForm) {
    // 
    // 
    var isok = true;

    if (
      (this.dataQuestion1.CLASS_ID == undefined ||
        this.dataQuestion1.CLASS_ID == null ||
        this.dataQuestion1.CLASS_ID == 0) &&
      (this.dataQuestion1.SUBJECT_ID == undefined ||
        this.dataQuestion1.SUBJECT_ID == null ||
        this.dataQuestion1.SUBJECT_ID == 0) &&
      (this.dataQuestion1.CHAPTER_ID == undefined ||
        this.dataQuestion1.CHAPTER_ID == null ||
        this.dataQuestion1.CHAPTER_ID == 0) &&
      (this.dataQuestion1.MEDIUM_ID == undefined ||
        this.dataQuestion1.MEDIUM_ID == null ||
        this.dataQuestion1.MEDIUM_ID < 0) &&
      (this.dataQuestion1.QUESTION_TYPE == undefined ||
        this.dataQuestion1.QUESTION_TYPE == null ||
        this.dataQuestion1.QUESTION_TYPE == 0)
    ) {
      isok = false;
      this.message.error(' Please Select All Required Fields ', '');
    } else if (
      this.dataQuestion1.CLASS_ID == undefined ||
      this.dataQuestion1.CLASS_ID == null ||
      this.dataQuestion1.CLASS_ID == 0
    ) {
      isok = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.dataQuestion1.SUBJECT_ID == undefined ||
      this.dataQuestion1.SUBJECT_ID == null ||
      this.dataQuestion1.SUBJECT_ID == 0
    ) {
      isok = false;
      this.message.error('Please Select Subject', '');
    } else if (
      this.dataQuestion1.CHAPTER_ID == undefined ||
      this.dataQuestion1.CHAPTER_ID == null ||
      this.dataQuestion1.CHAPTER_ID == 0
    ) {
      isok = false;
      this.message.error('Please Select Chapter', '');
    } else {
      if (
        this.dataQuestion1.MEDIUM_ID == null ||
        this.dataQuestion1.MEDIUM_ID == undefined
      ) {
        isok = false;
        this.message.error('Please Select Medium', '');
      } else if (
        this.dataQuestion1.QUESTION_TYPE == undefined ||
        this.dataQuestion1.QUESTION_TYPE == null ||
        this.dataQuestion1.QUESTION_TYPE == 0
      ) {
        isok = false;
        this.message.error('Please Select Question Type', '');
      } else if (this.allquestionData.length == 0) {
        isok = false;
        this.message.error('Question Data is Empty ', '');
      }

      if (isok) {
        this.allquestionData.forEach((element) => {
          let dataQuestion: QuestionDataModal = new QuestionDataModal();
          dataQuestion.CHAPTER_ID = this.dataQuestion1.CHAPTER_ID;
          dataQuestion.SUBJECT_ID = this.dataQuestion1.SUBJECT_ID;
          dataQuestion.QUESTION_TYPE = this.dataQuestion1.QUESTION_TYPE;
          dataQuestion.QUESTION_IMAGE = this.dataQuestion1.QUESTION_IMAGE;
          dataQuestion.ANSWER = element['ANSWER'];
          dataQuestion.ANSWER_IMAGE = this.dataQuestion1.ANSWER_IMAGE;
          dataQuestion.CLASS_ID = this.dataQuestion1.CLASS_ID;
          dataQuestion.MEDIUM_ID = this.dataQuestion1.MEDIUM_ID;
          dataQuestion.MARKS = element['MARKS'];
          dataQuestion.SEQ_NO = this.dataQuestion1.SEQ_NO++;
          dataQuestion.STATUS = true;
          dataQuestion.DIRECTION = element['DIRECTION'];
          dataQuestion.DESCRIPTION = element['DESCRIPTION'];
          dataQuestion.QUESTION = element['QUESTION'];
          dataQuestion.CLIENT_ID = this.api.clientId;

          if (
            element['OPTION_E'] == '' &&
            this.dataQuestion1.QUESTION_TYPE == 1
          ) {
            dataQuestion.OPTIONS = [
              {
                OPTION_TEXT: element['OPTION_A'],
                OPTION_IMAGE_URL: '',
                IS_CORRECT: element['ANSWER'] == 'A' ? 1 : 0,
                STATUS: 1,
                SEQ_NO: 1,
              },
              {
                OPTION_TEXT: element['OPTION_B'],
                OPTION_IMAGE_URL: '',
                IS_CORRECT: element['ANSWER'] == 'B' ? 1 : 0,
                STATUS: 1,
                SEQ_NO: 2,
              },
              {
                OPTION_TEXT: element['OPTION_C'],
                OPTION_IMAGE_URL: '',
                IS_CORRECT: element['ANSWER'] == 'C' ? 1 : 0,
                STATUS: 1,
                SEQ_NO: 3,
              },
              {
                OPTION_TEXT: element['OPTION_D'],
                OPTION_IMAGE_URL: '',
                IS_CORRECT: element['ANSWER'] == 'D' ? 1 : 0,
                STATUS: 1,
                SEQ_NO: 4,
              },
            ];
          } else if (
            element['OPTION_E'] != '' &&
            this.dataQuestion1.QUESTION_TYPE == 1
          ) {
            dataQuestion.OPTIONS = [
              {
                OPTION_TEXT: element['OPTION_A'],
                IS_CORRECT: element['ANSWER'] == 'A' ? 1 : 0,
                OPTION_IMAGE_URL: '',

                STATUS: 1,
                SEQ_NO: 1,
              },
              {
                OPTION_TEXT: element['OPTION_B'],
                IS_CORRECT: element['ANSWER'] == 'B' ? 1 : 0,
                OPTION_IMAGE_URL: '',

                STATUS: 1,
                SEQ_NO: 2,
              },
              {
                OPTION_TEXT: element['OPTION_C'],
                IS_CORRECT: element['ANSWER'] == 'C' ? 1 : 0,
                OPTION_IMAGE_URL: '',

                STATUS: 1,
                SEQ_NO: 3,
              },
              {
                OPTION_TEXT: element['OPTION_D'],
                IS_CORRECT: element['ANSWER'] == 'D' ? 1 : 0,
                OPTION_IMAGE_URL: '',

                STATUS: 1,
                SEQ_NO: 4,
              },
              {
                OPTION_TEXT: element['OPTION_E'],
                IS_CORRECT: element['ANSWER'] == 'E' ? 1 : 0,
                OPTION_IMAGE_URL: '',

                STATUS: 1,
                SEQ_NO: 5,
              },
            ];
          } else {
            dataQuestion.OPTIONS = [];
          }
          dataQuestion = Object.assign({}, dataQuestion);
          this.finalJSON.push(dataQuestion);

          this.finalJSON1 = this.finalJSON;
        });

        
        this.isSaveSpinning = true;
        this.api.assessmentQuestionsImporter(this.finalJSON1).subscribe(
          (successCode) => {
            
            if (successCode['code'] == '200') {
              this.message.success('Questions Added Successfully ...', '');
              this.finalJSON1 = [];
              this.allquestionData = [];
              // this.myInputVariable.nativeElement.value = null;
              this.filetxt = null;
              this.selectedFileName = null;
              this.dataQuestion1 = new QuestionDataModal();
              this.dataQuestion1.CLASS_ID = Number(
                sessionStorage.getItem('classid')
              );
              this.resetDrawer(questionpage);
            } else {
              this.message.error('Questions Adding Failed...', '');
              this.finalJSON1 = [];
              this.allquestionData = [];
            }
            this.isSaveSpinning = false;
          },
          (err) => {
            
            this.message.error('Server Error...', '');
            this.isSaveSpinning = false;
          }
        );
      }
    }
  }
  resetDrawer(questionpage: NgForm) {
    this.dataQuestion1 = new QuestionDataModal();
    this.dataQuestion1.CLASS_ID = Number(sessionStorage.getItem('classid'));
    questionpage.form.markAsPristine();
    questionpage.form.markAsUntouched();
    window.location.reload()
  }

  downloadTXT() {
    if (
      this.dataQuestion1.QUESTION_TYPE == 0 ||
      this.dataQuestion1.QUESTION_TYPE == null ||
      this.dataQuestion1.QUESTION_TYPE == undefined
    ) {
      this.message.error('Please Select Question Type', '');
    } else {
      let a = document.createElement('a');
      a.download = '';
      if (this.dataQuestion1.QUESTION_TYPE == 1) {
        a.href = 'assets/McQQuestion.txt';
        a.download = 'MCQ Questions Sample'
      } else {
        a.href = 'assets/DescriptiveQuestion.txt';
        a.download = 'Descriptive Questions Sample'

      }
      a.click();
    }
  }
}
