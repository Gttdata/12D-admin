import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { studentfeedetails } from '../../../Models/studentfeedetails';
interface TableDataItem {
  IS_MAPPED: boolean;
  NAME: string;
  AMOUNT: number;
  ID: number;
  TOTAL_FEE: number;
  PENDING_FEE: number;
  PAID_FEE: number;
}
@Component({
  selector: 'app-StudentWiseFeeMap',
  templateUrl: './StudentWiseFeeMap.component.html',
  styleUrls: ['./StudentWiseFeeMap.component.css'],
})
export class StudentWiseFeeMapComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  public commonFunction = new CommomFunctionsService();
  @Input() classId;
  @Input() feeData;
  @Input() drawerClose: any = Function;
  @Input()
  drawerVisible: boolean = false;
  @Input() MapData: studentfeedetails = new studentfeedetails();
  roleId: any;
  totalAmount: number = 0.0;
  discountAmount: number = 0.0;
  tableData: TableDataItem[] = [];
  ngOnInit() {
    this.GetHeadData();
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.MapData.DISCOUNT_TYPE = 'A';
    this.MapData.PAID_FEE = 0;
  }
  PAIDFEE: any = 0;
  getData() {
    this.isSpinning = true;
    this.api
      .getstudentFeeDetails(
        0,
        0,
        'id',
        'asc',
        'AND CLASS_ID =' +
          this.MapData.CLASS_ID +
          ' AND DIVISION_ID =' +
          this.MapData.DIVISION_ID +
          ' AND YEAR_ID = ' +
          this.MapData.YEAR_ID +
          ' AND STUDENT_ID = ' +
          this.MapData.STUDENT_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            this.feeData = data['data'];
            // Initialize total values to 0 before the loop
            this.MapData.TOTAL_FEE = 0;
            this.PAIDFEE = 0;
            this.MapData.PENDING_FEE = 0;

            if (this.feeData.length > 0) {
              for (let i = 0; i < this.feeData.length; i++) {
                // Accumulate values

                // Accumulate values only if the properties exist
                this.MapData.TOTAL_FEE += this.feeData[i]['TOTAL_FEE'];
                this.PAIDFEE += this.feeData[i]['PAID_FEE'];
                this.MapData.PENDING_FEE += this.feeData[i]['PENDING_FEE'];

                const matchingTableData = this.tableData.find(
                  (td) => td.ID === this.feeData[i]['HEAD_ID']
                );
                if (matchingTableData) {
                  matchingTableData.IS_MAPPED = true;
                  matchingTableData.PENDING_FEE =
                    this.feeData[i]['PENDING_FEE'];
                  matchingTableData.TOTAL_FEE = this.feeData[i]['TOTAL_FEE'];
                  matchingTableData.PAID_FEE = this.feeData[i]['PAID_FEE'];
                }
                this.Total += this.feeData[i]['AMOUNT'];
              }

              if (this.tableData.length >= 0) {
                // console.log(this.tableData);
                this.IsAvailable(true);
              }
            } else {
              this.Total = 0;
              this.feeData = [];
            }
          } else {
            this.feeData = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          // Handle error if needed
        }
      );
  }

  HeadDatalist: any = [];
  loadHeadData: boolean = false;
  storeTableData: any = [];
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
              const tableRecord: any = {
                IS_MAPPED:
                  dataItem.IS_MAPPED !== undefined ? dataItem.IS_MAPPED : false,
                NAME: dataItem.NAME || '', // Add a default value if CLASS_NAME is undefined
                TOTAL_FEE:
                  dataItem.TOTAL_FEE !== undefined ? dataItem.TOTAL_FEE : 0,
                PENDING_FEE:
                  dataItem.PENDING_FEE !== undefined ? dataItem.PENDING_FEE : 0,
                PAID_FEE:
                  dataItem.PAID_FEE !== undefined ? dataItem.PAID_FEE : 0,
                ID: dataItem.ID,
              };
              this.tableData.push(tableRecord);
              this.storeTableData = this.tableData;
            });
            // console.log(this.tableData)
            this.loadHeadData = false;
          } else {
            this.HeadDatalist = [];
            this.loadHeadData = false;
          }
          this.getData();
        } else {
          this.message.error('Failed To Get Head Data.', '');
          this.HeadDatalist = [];
          this.loadHeadData = false;
        }
      });
  }

  DataTable: Array<{
    PAID_FEE: any;
    PENDING_FEE: any;
    TOTAL_FEE: any;
    ID: any;
    NAME: string;
    IS_MAPPED: boolean;
    CLASS_NAME: string;
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

  close() {
    this.drawerClose();
  }
  save() {
    this.isOk = true;
    // see the AMOUNT being 0 when IS_MAPPED is true
    const hasZeroAmountAndMapped = this.tableData.some((item) => {
      return (
        item.IS_MAPPED &&
        (item.TOTAL_FEE === 0 ||
          item.TOTAL_FEE == null ||
          item.TOTAL_FEE == undefined)
      );
    });

    if (hasZeroAmountAndMapped) {
      this.isOk = false;
      this.message.error('Please fill in the Amount for mapped Heads.', '');
      return; // Stop execution if there are items with IS_MAPPED true and AMOUNT 0
    }
    // console.log(this.MapData);
    this.MapData.PAID_FEE = this.MapData.TOTAL_FEE - this.MapData.PENDING_FEE;
    let formattedData = this.tableData
      .filter((item: any) => item.IS_MAPPED)
      .map((item: any) => ({
        HEAD_ID: item.ID,
        PAID_FEE: item.PAID_FEE,
        TOTAL_FEE: item.TOTAL_FEE,
        PENDING_FEE: item.PENDING_FEE,
      }));

    const dataToSave = {
      ID: this.MapData.ID,

      CLASS_ID: this.MapData.CLASS_ID,
      YEAR_ID: this.MapData.YEAR_ID,
      STUDENT_ID: this.MapData.STUDENT_ID,
      DIVISION_ID: this.MapData.DIVISION_ID,

      PENDING_FEE:
        this.MapData.PENDING_FEE == 0 ? '0' : this.MapData.PENDING_FEE,
      TOTAL_FEE: this.MapData.TOTAL_FEE,
      PAID_FEE: this.MapData.PAID_FEE,

      DISCOUNT_VALUE: this.MapData.DISCOUNT_VALUE,
      DISCOUNT_TYPE: this.MapData.DISCOUNT_TYPE,
      DISCOUNT_AMOUNT: this.MapData.DISCOUNT_AMOUNT,
      IS_DISCOUNT_AVAILABLE: this.MapData.IS_DISCOUNT_AVAILABLE,

      feeDetails: formattedData,
    };
    if (this.isOk) {
      if (dataToSave.feeDetails.length > 0) {
        this.isSpinning = true;
        this.api.mapstudentFeeDetails(dataToSave).subscribe((data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Information has been Added successfully...',
              ''
            );
            this.isSpinning = false;
            this.close();
          } else {
            this.message.error('Information creation failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.message.error(
          'Please map at least one Head before proceeding...',
          ''
        );
        this.isSpinning = false;
      }
    }
  }
  onIsMappedChange(newIsMappedValue: boolean, rowData: any) {
    // If IS_MAPPED is set to false, then Amount Should be clear
    if (!newIsMappedValue) {
      rowData.PENDING_FEE = null;
      rowData.PAID_FEE = null;
      rowData.TOTAL_FEE = null;
    }
  }
  //old
  ShowPaidFee() {
    this.isOk = true;
    if (
      this.MapData.PAID_FEE == undefined ||
      this.MapData.PAID_FEE == null ||
      this.MapData.PAID_FEE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter a valid Fee before Mapping.', '');
    }

    if (this.isOk) {
      // Reset PAID_FEE and PENDING_FEE values
      const originalPendingFees = this.storeTableData.map(
        (data) => data.TOTAL_FEE
      );

      // Get the entered paid fee
      let enteredPaidFee: any = parseFloat(this.MapData.PAID_FEE) || 0;
      let remainingPaidFee = enteredPaidFee;
      let remainingAfterminus = enteredPaidFee;

      // Iterate through the tableData array
      for (let i = 0; i < this.tableData.length; i++) {
        const data23 = this.tableData[i];
        if (data23.PENDING_FEE > 0 && remainingAfterminus > 0) {
          // Calculate the amount to be paid for the current record it will return min value in both of them
          var rm = 0;
          console.log(data23.TOTAL_FEE, '-', data23.PAID_FEE);
          rm = data23.TOTAL_FEE - data23.PAID_FEE;
          console.log(rm, '-', remainingAfterminus);
          if (rm < remainingAfterminus) {
            data23.PAID_FEE += rm;
            data23.PENDING_FEE = data23.PENDING_FEE - rm;
            remainingAfterminus = remainingAfterminus - rm;
          } else {
            data23.PAID_FEE += remainingAfterminus;
            data23.PENDING_FEE = data23.PENDING_FEE - remainingAfterminus;
            remainingAfterminus = 0;
          }
        } else {
        }
      }

      this.MapData.TOTAL_FEE = 0;
      this.PAIDFEE = 0;
      this.MapData.PENDING_FEE = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        this.MapData.TOTAL_FEE += Number(this.tableData[i]['TOTAL_FEE']);
        this.MapData.PENDING_FEE += Number(this.tableData[i]['PENDING_FEE']);
        this.PAIDFEE += Number(this.tableData[i]['PAID_FEE']);
      }
      this.MapData.PAID_FEE = 0;
    }
  }

  /// after
  // ShowPaidFee() {
  //   this.isOk = true;
  //   if (
  //     this.MapData.PAID_FEE == undefined ||
  //     this.MapData.PAID_FEE == null ||
  //     this.MapData.PAID_FEE == 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter a valid Fee before Mapping.', '');
  //   }

  //   if (this.isOk) {
  //     // Reset PAID_FEE and PENDING_FEE values
  //     const originalPendingFees = this.storeTableData.map(
  //       (data) => data.PENDING_FEE
  //     );
  //     console.log(this.storeTableData);
  //     this.tableData.forEach((data, index) => {
  //       if (data.PENDING_FEE > 0) {
  //         data.PAID_FEE = 0;

  //         //  ORIGINAL_PENDING_FEE  in storeTableData
  //         data.PENDING_FEE = originalPendingFees[index];
  //       }
  //       // console.log('data.PAID_FEE', data.PAID_FEE);
  //     });

  //     // Get the entered paid fee
  //     let enteredPaidFee: any = parseFloat(this.MapData.PAID_FEE) || 0;
  //     let remainingPaidFee = enteredPaidFee;
  //     // console.log('remainingPaidFee', remainingPaidFee);

  //     // Iterate through the tableData array
  //     for (let i = 0; i < this.tableData.length; i++) {
  //       const data = this.tableData[i];

  //     // console.log('data', data);

  //       if (data.PENDING_FEE > 0) {
  //         // Calculate the amount to be paid for the current record it will return min value in both of them
  //         const amountToPay = Math.min(remainingPaidFee, data.PENDING_FEE);
  //         // Update the PAID_FEE and PENDING_FEE values for the current record
  //         data.PAID_FEE += amountToPay+ Number(this.feeData[i]['PAID_FEE']) ;
  //         data.PENDING_FEE -= amountToPay;

  //         // Deduct the paid amount from the remainingPaidFee
  //         remainingPaidFee -= amountToPay;
  //       }
  //     }

  //     this.MapData.TOTAL_FEE = 0;
  //     this.MapData.PENDING_FEE = 0;
  //     this.PAIDFEE=0
  //     console.log('this.tableData', this.tableData);
  //     console.log('this.feeData',this.feeData);

  //     for (let i = 0; i < this.tableData.length; i++) {
  //       this.MapData.TOTAL_FEE += Number(this.tableData[i]['TOTAL_FEE']);
  //       this.MapData.PENDING_FEE += Number(this.tableData[i]['PENDING_FEE']);
  //       this.PAIDFEE += Number(this.tableData[i]['PAID_FEE']);
  //     }
  //     this.MapData.PAID_FEE=0
  //   }
  // }

  onTotalAmountChange(newValue: number, data: any) {
    // console.log(newValue, data);

    if (newValue != undefined) {
      // Assuming TOTAL_FEE and PAID_FEE are numbers
      data.PENDING_FEE = newValue - data.PAID_FEE;
      // this.MapData.TOTAL_FEE += Number(newValue);
      this.MapData.TOTAL_FEE = 0;
      this.MapData.PENDING_FEE = 0;
      this.PAIDFEE = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        this.MapData.TOTAL_FEE += Number(this.tableData[i]['TOTAL_FEE']);
        this.MapData.PENDING_FEE += Number(this.tableData[i]['PENDING_FEE']);
        this.PAIDFEE += Number(this.tableData[i]['PAID_FEE']);
      }
      this.IsAvailable(true);
    }
  }

  onPaidFeeChange(paidAmount: any) {
    this.isOk = true;
    if (paidAmount > this.MapData.PENDING_FEE) {
      this.isOk = false;
      this.message.error('Please Check Pending Amount... ', '');
      this.MapData.PAID_FEE = 0;
      paidAmount = 0;
    } else {
      this.isOk = false;
    }
  }

  handleOk(): void {}

  IsAvailable(data: any) {
    // console.log(this.tableData.length, this.tableData);

    if (this.tableData != undefined && this.tableData != null) {
      this.MapData.SUB_TOTAL = 0;

      for (let i = 0; i < this.tableData.length; i++) {
        if (!isNaN(this.tableData[i]['TOTAL_FEE'])) {
          // console.log(this.tableData[i]['TOTAL_FEE']);
          this.MapData.SUB_TOTAL += Number(this.tableData[i]['TOTAL_FEE']);
        } else {
          // console.log("Invalid TOTAL_FEE value:", this.tableData[i]['TOTAL_FEE']);
        }
      }

      if (
        this.MapData.DISCOUNT_VALUE != undefined ||
        this.MapData.DISCOUNT_TYPE != undefined
      ) {
        this.calculateTotal();
      } else {
      }
    } else {
      console.log('Data is undefined or null');
    }
  }

  onTotalDiscountChange(discRate: number): void {
    if (discRate >= 0 && discRate <= 100 && this.MapData.DISCOUNT_TYPE == 'P') {
      this.MapData.DISCOUNT_VALUE = discRate;
      this.calculateTotal();
    } else if (
      discRate >= 0 &&
      discRate <= this.MapData.SUB_TOTAL &&
      this.MapData.DISCOUNT_TYPE == 'A'
    ) {
      this.MapData.DISCOUNT_VALUE = discRate;
      this.calculateTotal();
    } else if (discRate > 100 && this.MapData.DISCOUNT_TYPE == 'P') {
      this.message.error('Please Enter Percentage between 0 to 100... ', '');
    } else {
      this.message.error(
        'Please Enter Amount between 0 to ' + this.MapData.SUB_TOTAL,
        ''
      );
    }
  }

  onTotalDiscountTypeChange(discType: string): void {
    this.MapData.DISCOUNT_TYPE = discType;
    this.calculateTotal();
  }

  calculateTotal(): void {
    const subTotal = parseFloat(this.MapData.SUB_TOTAL.toString());

    this.MapData.DISCOUNT_AMOUNT = 0;
    if (this.MapData.DISCOUNT_TYPE === 'P') {
      this.MapData.DISCOUNT_AMOUNT =
        (subTotal * parseFloat(this.MapData.DISCOUNT_VALUE)) / 100;
    } else {
      this.MapData.DISCOUNT_AMOUNT = parseFloat(this.MapData.DISCOUNT_VALUE);
    }

    this.totalAmount = subTotal - this.MapData.DISCOUNT_AMOUNT;
    // console.log(this.totalAmount);
  }
}
