import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
export class DataArray {
  CLASS_NAME;
  HEAD_ID: any;
  CLASS_ID: number;
  YEAR_ID: any;
  AMOUNT: any;
  DIVISION_ID: any;
  YEAR_NAME: any;
  DIVISION_NAME: any;
  HEAD_NAME: any;
}
export class MapData {
  IS_MAPPED: boolean;
  NAME: string;
  AMOUNT: number;
  ID: number;
}
@Component({
  selector: 'app-MapFee',
  templateUrl: './MapFee.component.html',
  styleUrls: ['./MapFee.component.css'],
})
export class MapFeeComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  public commonFunction = new CommomFunctionsService();
  @Input() classId;
  @Input() classNAME;
  @Input() drawerClose: any = Function;
  @Input()
  drawerVisible: boolean = false;
  roleId: any;
  ngOnInit() {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.MapData.CLASS_ID = this.classId;
    this.MapData.CLASS_NAME = this.classNAME;
    this.MapData.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.GetHeadData();
    this.GetYearData();
    this.GetDivisionData();
  }

  MapData: DataArray = new DataArray();
  HeadDatalist: any = [];
  loadHeadData: boolean = false;
  tableData: Array<{
    IS_MAPPED: boolean;
    NAME: string;
    AMOUNT: number;
    ID: number;
  }> = [];
  GetHeadData() {
    this.loadHeadData = true;

    this.api
      .getHeadData(
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
            this.DataTable = data['data'];
            this.DataTable.forEach((dataItem) => {
              const tableRecord = {
                IS_MAPPED:
                  dataItem.IS_MAPPED !== undefined ? dataItem.IS_MAPPED : false,
                NAME: dataItem.NAME || '', // Add a default value if CLASS_NAME is undefined
                AMOUNT: dataItem.AMOUNT !== undefined ? dataItem.AMOUNT : 0,
                ID: dataItem.ID,
              };
              this.tableData.push(tableRecord);
            });
            
            this.loadHeadData = false;
          } else {
            this.HeadDatalist = [];
            this.loadHeadData = false;
          }
        } else {
          this.message.error('Failed To Get Head Data.', '');
          this.HeadDatalist = [];
          this.loadHeadData = false;
        }
      });
  }

  DataTable: Array<{
    ID: any;
    NAME: string;
    IS_MAPPED: boolean;
    CLASS_NAME: string;
    AMOUNT: number;
  }> = [];
  isOk: boolean = true;
  isSpinning: boolean = false;
  Data: any = [];

  Total: any = 0;
  loadingRecords = false;

  onAmountChange(event: any) {
    // Assuming this.tableData is the array containing your data
    this.Total = this.tableData.reduce((sum, item) => {
      // Only add the amount if IS_MAPPED is true
      if (item.IS_MAPPED) {
        const amount = Number(item.AMOUNT) || 0; // Convert to number, use 0 if conversion fails
        return sum + amount;
      }
      return sum;
    }, 0); // Initial value of sum is 0
  }

  onIsMappedChange(newIsMappedValue: boolean, rowData: any) {
    
    

    // If IS_MAPPED is set to false, then Amount Should be clear
    if (!newIsMappedValue) {
      if (
        rowData.AMOUNT != null &&
        rowData.AMOUNT != undefined &&
        rowData.AMOUNT != ''
      ) {
        var total: any = 0;
        total = Number(this.Total) - Number(rowData.AMOUNT);
        this.Total = Number(total);
        rowData.AMOUNT = 0;
      }
    }
  }
  onYearChange(selectedId: number): void {
    if (
      this.MapData.DIVISION_ID != null &&
      this.MapData.DIVISION_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.classId +
            ' AND DIVISION_ID =' +
            this.MapData.DIVISION_ID +
            ' AND YEAR_ID = ' +
            selectedId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Data = data['data'];

              // Initialize Total
              this.Total = 0;

              // Reset all IS_MAPPED to false before processing the new data
              this.tableData.forEach((item) => {
                item.IS_MAPPED = false;
                item.AMOUNT = 0;
              });

              if (this.Data.length > 0) {
                for (let i = 0; i < this.Data.length; i++) {
                  this.Total += this.Data[i]['AMOUNT'];

                  // Find the corresponding Head in tableData
                  const correspondingItemIndex = this.tableData.findIndex(
                    (item) => item.ID === this.Data[i].HEAD_ID
                  );

                  if (correspondingItemIndex !== -1) {
                    // Update IS_MAPPED, AMOUNT, and NAME if HEAD_ID matches ID
                    this.tableData[correspondingItemIndex].IS_MAPPED = true;
                    this.tableData[correspondingItemIndex].AMOUNT =
                      this.Data[i].AMOUNT;
                    this.tableData[correspondingItemIndex].NAME =
                      this.Data[i].HEAD_NAME;
                    this.tableData[correspondingItemIndex].ID =
                      this.Data[i].HEAD_ID;
                  } else {
                    // If there is no corresponding Head, add a new record
                    const tableRecord = {
                      IS_MAPPED: false,
                      NAME: this.Data[i].HEAD_NAME,
                      AMOUNT: this.Data[i].AMOUNT,
                      ID: this.Data[i].HEAD_ID,
                    };
                    this.tableData.push(tableRecord);
                  }
                }
              } else {
                // If Data length is 0, set all amounts to null and IS_MAPPED to false
                this.tableData.forEach((item) => {
                  item.IS_MAPPED = false;
                  item.AMOUNT = null;
                });
                this.Total = 0;
              }
            } else {
              this.Data = [];
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  onDivisionChange(selectedId: any): void {
    if (this.MapData.YEAR_ID != null && this.MapData.YEAR_ID != undefined && selectedId.length) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.classId +
            ' AND YEAR_ID =' +
            this.MapData.YEAR_ID +
            ' AND DIVISION_ID = ' +
            selectedId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Data = data['data'];

              // Initialize Total
              this.Total = 0;

              if (this.Data.length > 0) {
                for (let i = 0; i < this.Data.length; i++) {
                  this.Total += this.Data[i]['AMOUNT'];

                  // Find the corresponding Head in tableData
                  const correspondingItemIndex = this.tableData.findIndex(
                    (item) => item.ID === this.Data[i].HEAD_ID
                  );

                  if (correspondingItemIndex !== -1) {
                    // Update IS_MAPPED, AMOUNT, and NAME if HEAD_ID matches ID
                    this.tableData[correspondingItemIndex].IS_MAPPED = true;
                    this.tableData[correspondingItemIndex].AMOUNT =
                      this.Data[i].AMOUNT;
                    this.tableData[correspondingItemIndex].NAME =
                      this.Data[i].HEAD_NAME;
                    this.tableData[correspondingItemIndex].ID =
                      this.Data[i].HEAD_ID;
                  } else {
                    // If there is no corresponding Head, add a new record
                    const tableRecord = {
                      IS_MAPPED: false,
                      NAME: this.Data[i].HEAD_NAME,
                      AMOUNT: this.Data[i].AMOUNT,
                      ID: this.Data[i].HEAD_ID,
                    };
                    this.tableData.push(tableRecord);
                  }
                  
                }
              } else {
                // If Data length is 0, set all amounts to null and IS_MAPPED to false
                this.tableData.forEach((item) => {
                  item.IS_MAPPED = false;
                  item.AMOUNT = null;
                });
                this.Total = 0;
              }
            } else {
              this.Data = [];
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  close() {
    this.drawerClose();
  }
  switchValue = true;

  save() {
    this.isOk = true;
    this.switchValue = true;

    if (
      (this.MapData.DIVISION_ID == undefined ||
        this.MapData.DIVISION_ID == null) &&
      (this.MapData.YEAR_ID == undefined || this.MapData.YEAR_ID == null)
    ) {
      this.isOk = false;
      this.message.error(
        'Please Select Division & Year for Mapped Heads. ',
        ''
      );
    } else if (
      this.MapData.DIVISION_ID == undefined ||
      this.MapData.DIVISION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Division.', '');
    } else if (
      this.MapData.YEAR_ID == undefined ||
      this.MapData.YEAR_ID == null ||
      this.MapData.YEAR_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Year.', '');
    } else if (
      this.tableData.some(
        (item) => item.IS_MAPPED && (!item.AMOUNT || item.AMOUNT === 0)
      )
    ) {
      this.isOk = false;
      this.message.error('Please fill in the Amount for mapped Heads.', '');
    } else {
      this.switchValue = false;
    }

    // see the AMOUNT being 0 when IS_MAPPED is true
    // const hasZeroAmountAndMapped = this.tableData.some((item) => {
    //   return (
    //     item.IS_MAPPED &&
    //     (item.AMOUNT === 0 || item.AMOUNT == null || item.AMOUNT == undefined)
    //   );
    // });

    // 

    // if (hasZeroAmountAndMapped) {
    //   this.message.error('Please fill in the Amount for mapped Heads.', '');
    //   return; // Stop execution if there are items with IS_MAPPED true and AMOUNT 0
    // }
  }

  confirm() {
    if (this.isOk) {
      let formattedData = this.tableData
      .filter((item: any) => item.IS_MAPPED)
      .map((item: any) => ({
        HEAD_ID: item.ID,
        AMOUNT: item.AMOUNT,
        // DIVISION_ID: this.MapData.DIVISION_ID,
      }));

    const dataToSave = {
      CLASS_ID: this.classId,
      YEAR_ID: this.MapData.YEAR_ID,
      TOTAL_FEES: this.Total,
      feeDetails: [],
      // DIVISION_ID: this.MapData.DIVISION_ID,
    };

    let len = this.MapData.DIVISION_ID.length;
    for (let i = 0; i < len; i++) {
      // Create a deep copy of formattedData
      let deepCopyFormattedData = JSON.parse(JSON.stringify(formattedData));
      for (let j = 0; j < deepCopyFormattedData.length; j++) {
        deepCopyFormattedData[j]['DIVISION_ID'] = this.MapData.DIVISION_ID[i];
      }
      dataToSave.feeDetails.push(...deepCopyFormattedData);
    }
    dataToSave['DIVISION_ID'] = this.MapData.DIVISION_ID;

      if (dataToSave.feeDetails.length > 0) {
        this.api.mapClassBulk(dataToSave).subscribe((data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Information has been Added successfully...',
              ''
            );
            this.close();
          } else {
            this.message.error('Information creation failed...', '');
          }
        });
      } else {
        this.message.error(
          'Please map at least one Head before proceeding...',
          ''
        );
        
      }
    }
  }

  YearDatalist: any = [];
  loadYearData: boolean = false;
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
        ' AND STATUS=1  AND SCHOOL_ID = ' +
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
}
