import { Directive, HostListener, Input } from '@angular/core';
import { ExportService } from '../Services/export.service'
@Directive({
  selector: '[appExport]'
})
export class ExportDirective {

  constructor(private exportService: ExportService) { }

  @Input('appExport') dataList: any[]=[];
  @Input() fileName: string = '';
  converted:any;
  @HostListener('click', ['$event']) onClick($event: any) {
    // 
    // 

    // if (this.fileName == "Inward Data") {
    //   this.dataList = this.dataList.map(({
    //     INWARD_DATE: Inward_Date, VEHICLE_NO: Vehicle_Number, AGENT_NAME: Agent_Name,
    //      TOTAL_QTY: Total_Quantity(MT), REGION: Region
    //   }) =>
    //     { Inward_Date, Vehicle_Number, Agent_Name, Total_Quantity(MT), Region });
    //   // 
    // }
    // this.exportService.exportExcel(this.dataList, this.fileName);
    if(this.fileName=="Raw_Material_Inward")
    {
    this.dataList=this.dataList.map(({
      INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION }) => 
     ({INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION}));
     this.converted =  this.rekey(this.dataList, { INWARD_DATE: 'Inward Date',VEHICLE_NO: 'Vehicle Number',AGENT_NAME:'Agent Name',TOTAL_QTY:'Total Quantity(MT)',IS_COVERED:'Is Covered',IS_WET:'Is Wet',IS_BAD_SMELLED:'Is Bad Smelled',REGION:'Region'});
     
    }else

    if(this.fileName=="Inward_Quality_Check_Data")
    {
    this.dataList=this.dataList.map(({
      MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK }) => 
     ({MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK}));
     this.converted =  this.rekey(this.dataList, { MOISTURE: 'Moisture',TOTAL_MAIZE: 'Total Maize',DAMAGED_MAIZE:'Damaged Maize(gm)',DAMAGED_PERCENTAGE:'Damaged Percentage(%)',ALPHATOXIN_UNDER_UV:'Alphatoxin Under UV',ALPHATOXIN_ON_RAFTOR_PBB:'Alphatoxin On Raftor PBB',FOREIGN_MATERIAL:'Foreign Material(gm)',OTHER_EDIBLE_GRAINS:'Other Edible Grains(gm)',WEELIFIED_GRAINS:'Weelifted Grains(gm)',STATUS:'Status',QC_REMARK:'QC Remark'});
     
    }else

    if(this.fileName=="Inward_Unloading_Data")
    {
    this.dataList=this.dataList.map(({
      LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS }) => 
     ({LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS}));
     this.converted =  this.rekey(this.dataList, { LOT_NO: 'Lot Number',GRN_NO: ' GRN Number',M_25:' M-25',M_50:'M-50',M_75:'M-75',M_100:'M-100',M_125:'M-125',M_150:'M-150',ULOADED_LOCATION_TYPE:'Unloaded Location Type',ULOADED_LOCATION_ID:'Unloaded Location ID',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags',ACCEPTED_QTY:'Accepted Quantity(KG)',MASTER_STATUS:'Master Status'});
     
    }else
    
    if(this.fileName=="Rice_Raw_Material_Inward")
    {
    this.dataList=this.dataList.map(({
      INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION }) => 
     ({INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION}));
     this.converted =  this.rekey(this.dataList, { INWARD_DATE: 'Inward Date',VEHICLE_NO: 'Vehicle Number',AGENT_NAME:'Agent Name',TOTAL_QTY:'Total Quantity(MT)',IS_COVERED:'Is Covered',IS_WET:'Is Wet',IS_BAD_SMELLED:'Is Bad Smelled',REGION:'Region'});
     
    }else

    if(this.fileName=="RiceInward_Quality_Check_Data")
    {
    this.dataList=this.dataList.map(({
      MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK }) => 
     ({MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK}));
     this.converted =  this.rekey(this.dataList, { MOISTURE: 'Moisture',TOTAL_MAIZE: 'Total Maize',DAMAGED_MAIZE:'Damaged Maize(gm)',DAMAGED_PERCENTAGE:'Damaged Percentage(%)',ALPHATOXIN_UNDER_UV:'Alphatoxin Under UV',ALPHATOXIN_ON_RAFTOR_PBB:'Alphatoxin On Raftor PBB',FOREIGN_MATERIAL:'Foreign Material(gm)',OTHER_EDIBLE_GRAINS:'Other Edible Grains(gm)',WEELIFIED_GRAINS:'Weelifted Grains(gm)',STATUS:'Status',QC_REMARK:'QC Remark'});
     
    }else

    if(this.fileName=="RiceInward_Unloading_Data")
    {
    this.dataList=this.dataList.map(({
      LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS }) => 
     ({LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS}));
     this.converted =  this.rekey(this.dataList, { LOT_NO: 'Lot Number',GRN_NO: ' GRN Number',M_25:' M-25',M_50:'M-50',M_75:'M-75',M_100:'M-100',M_125:'M-125',M_150:'M-150',ULOADED_LOCATION_TYPE:'Unloaded Location Type',ULOADED_LOCATION_ID:'Unloaded Location ID',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags',ACCEPTED_QTY:'Accepted Quantity(KG)',MASTER_STATUS:'Master Status'});
     
    }else

    if(this.fileName=="Other_Raw_Material_Inward")
    {
    this.dataList=this.dataList.map(({
      INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION }) => 
     ({INWARD_DATE,VEHICLE_NO,AGENT_NAME,TOTAL_QTY,IS_COVERED,IS_WET,IS_BAD_SMELLED,REGION}));
     this.converted =  this.rekey(this.dataList, { INWARD_DATE: 'Inward Date',VEHICLE_NO: 'Vehicle Number',AGENT_NAME:'Agent Name',TOTAL_QTY:'Total Quantity(MT)',IS_COVERED:'Is Covered',IS_WET:'Is Wet',IS_BAD_SMELLED:'Is Bad Smelled',REGION:'Region'});
     
    }else

    if(this.fileName=="OtherMaterial_Inward_Quality_Check_Data")
    {
    this.dataList=this.dataList.map(({
      MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK }) => 
     ({MOISTURE,TOTAL_MAIZE,DAMAGED_MAIZE,DAMAGED_PERCENTAGE,ALPHATOXIN_UNDER_UV,ALPHATOXIN_ON_RAFTOR_PBB,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,STATUS,QC_REMARK}));
     this.converted =  this.rekey(this.dataList, { MOISTURE: 'Moisture',TOTAL_MAIZE: 'Total Maize',DAMAGED_MAIZE:'Damaged Maize(gm)',DAMAGED_PERCENTAGE:'Damaged Percentage(%)',ALPHATOXIN_UNDER_UV:'Alphatoxin Under UV',ALPHATOXIN_ON_RAFTOR_PBB:'Alphatoxin On Raftor PBB',FOREIGN_MATERIAL:'Foreign Material(gm)',OTHER_EDIBLE_GRAINS:'Other Edible Grains(gm)',WEELIFIED_GRAINS:'Weelifted Grains(gm)',STATUS:'Status',QC_REMARK:'QC Remark'});
     
    }else

    if(this.fileName=="OtherMaterial_Inward_Unloading_Data")
    {
    this.dataList=this.dataList.map(({
      LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS }) => 
     ({LOT_NO,GRN_NO,M_25,M_50,M_75,M_100,M_125,M_150,ULOADED_LOCATION_TYPE,ULOADED_LOCATION_ID,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,MASTER_STATUS}));
     this.converted =  this.rekey(this.dataList, { LOT_NO: 'Lot Number',GRN_NO: ' GRN Number',M_25:' M-25',M_50:'M-50',M_75:'M-75',M_100:'M-100',M_125:'M-125',M_150:'M-150',ULOADED_LOCATION_TYPE:'Unloaded Location Type',ULOADED_LOCATION_ID:'Unloaded Location ID',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags',ACCEPTED_QTY:'Accepted Quantity(KG)',MASTER_STATUS:'Master Status'});
     
    }else

    if(this.fileName=="Silo_Lot_Register_Data")
    {
    this.dataList=this.dataList.map(({
      LOT_NO,ULOADED_LOCATION_TYPE,LOADING_START_DATE,LOADING_END_DATE,FUMIGATION_START_DATE,FUMIGATION_END_DATE,UNLOADING_START_DATE,UNLOADING_END_DATE,CLEANING_START_DATE,CLEANING_END_DATE,TOTAL_QTY,BATCH_NO,REMARK,STATUS }) => 
     ({LOT_NO,ULOADED_LOCATION_TYPE,LOADING_START_DATE,LOADING_END_DATE,FUMIGATION_START_DATE,FUMIGATION_END_DATE,UNLOADING_START_DATE,UNLOADING_END_DATE,CLEANING_START_DATE,CLEANING_END_DATE,TOTAL_QTY,BATCH_NO,REMARK,STATUS}));
     this.converted =  this.rekey(this.dataList, { LOT_NO: 'Lot Number',ULOADED_LOCATION_TYPE: ' Unloaded Location Type',LOADING_START_DATE:' Loading Start Date',LOADING_END_DATE:'Loading End Date',FUMIGATION_START_DATE:'Fumigation Start Date',FUMIGATION_END_DATE:'Fumigation End Date',UNLOADING_START_DATE:'Unloading Start Date',UNLOADING_END_DATE:'Unloading End Date',CLEANING_START_DATE:'Cleaning Start Date',CLEANING_END_DATE:'Cleaning End Date',TOTAL_QTY:'Total Quantity(KG)',BATCH_NO:'Batch Number',REMARK:'Remark',STATUS:'Status'});
     
    }else 
    if(this.fileName=="SiloClean_Record_Data")
    {
    this.dataList=this.dataList.map(({
      SILO_NO,CLEANING_START_DATE,CLEANING_END_DATE,CHECK_POINT_OBSERVED,REMARK,CLEANIG_END_REMARK,STATUS }) => 
     ({SILO_NO,CLEANING_START_DATE,CLEANING_END_DATE,CHECK_POINT_OBSERVED,REMARK,CLEANIG_END_REMARK,STATUS}));
     this.converted =  this.rekey(this.dataList, { SILO_NO: 'Silo Number',CLEANING_START_DATE: 'Cleaning Start Date',CLEANING_END_DATE:'Cleaning End Date',CHECK_POINT_OBSERVED:'Check Point Observed',REMARK:'Remark',CLEANIG_END_REMARK:'Cleaning End Remark',STATUS:'Status'});
     
    }else
    if(this.fileName=="Vehicle_Detail")
    {
    this.dataList=this.dataList.map(({
      VEHICLE_NO,INWARD_DATE,TOTAL_QTY,ULOADED_LOCATION_TYPE,ACCEPTED_QTY,ACCEPTED_BAGS,REJECTED_BAGS,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,MOISTURE}) => 
     ({VEHICLE_NO,INWARD_DATE,TOTAL_QTY,ULOADED_LOCATION_TYPE,ACCEPTED_QTY,ACCEPTED_BAGS,REJECTED_BAGS,FOREIGN_MATERIAL,OTHER_EDIBLE_GRAINS,WEELIFIED_GRAINS,MOISTURE}));
     this.converted =  this.rekey(this.dataList, { VEHICLE_NO: 'Vehicle Number',INWARD_DATE: 'Inward Date',TOTAL_QTY:'Total Quantity(KG)',ULOADED_LOCATION_TYPE:'Unloaded Location Type',ACCEPTED_QTY:'Accepted Quantity(KG)',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags',FOREIGN_MATERIAL:'Foreign Material(gm)',OTHER_EDIBLE_GRAINS:'Other Edible Grains(gm)',WEELIFIED_GRAINS:'Weelified Grains(gm)',MOISTURE:'Moisture'});
     
    }else
    if(this.fileName=="Vehicle_Summary")
    {
    this.dataList=this.dataList.map(({
      VEHICLE_NO,TOTAL_INWARD_TIME,QC_ACCEPTED,QC_REJECTED,QC_CON_ACCEPTED,TOTAL_QTY,ACCEPTED_BAGS,REJECTED_BAGS}) => 
     ({VEHICLE_NO,TOTAL_INWARD_TIME,QC_ACCEPTED,QC_REJECTED,QC_CON_ACCEPTED,TOTAL_QTY,ACCEPTED_BAGS,REJECTED_BAGS}));
     this.converted =  this.rekey(this.dataList, { VEHICLE_NO: 'Vehicle Number',TOTAL_INWARD_TIME: 'Total Inward Times',QC_ACCEPTED:'QC Accepted',QC_REJECTED:'QC Rejected',QC_CON_ACCEPTED:'QC Conditionally Accepted',TOTAL_QTY:'Total Inward Quantity(KG)',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags'});
     
    }else
    if(this.fileName=="Silo_Status_Report")
    {
    this.dataList=this.dataList.map(({
      SILO_NAME,ACTIVITY_DATE_TIME,SILO_ACTIVITY_NAME}) => 
     ({SILO_NAME,ACTIVITY_DATE_TIME,SILO_ACTIVITY_NAME}));
     this.converted =  this.rekey(this.dataList, { SILO_NAME: 'Silo Name',ACTIVITY_DATE_TIME: 'Date & Time',SILO_ACTIVITY_NAME:'Activity'});
     
    }else
    if(this.fileName=="Datewise_Report")
    {
    this.dataList=this.dataList.map(({
      DATE,VEHICALS,QC_ACCEPTED,QC_CON_ACCEPTED,QC_REJECTED,TOTAL_QTY,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,AVG_MOISTURE,AVG_ULOADED_MOISURE,SILO_ACCEPTED_QTY,WAREHOUSE_ACCEPTED_QTY}) => 
     ({DATE,VEHICALS,QC_ACCEPTED,QC_CON_ACCEPTED,QC_REJECTED,TOTAL_QTY,ACCEPTED_BAGS,REJECTED_BAGS,ACCEPTED_QTY,AVG_MOISTURE,AVG_ULOADED_MOISURE,SILO_ACCEPTED_QTY,WAREHOUSE_ACCEPTED_QTY}));
     this.converted =  this.rekey(this.dataList, { DATE: 'Date',VEHICALS: 'Total Vehicle',QC_ACCEPTED:'QC Accepted',QC_CON_ACCEPTED:'QC Conditionally Accepted',QC_REJECTED:'QC Rejected',TOTAL_QTY:'Total Quantity',ACCEPTED_BAGS:'Accepted Bags',REJECTED_BAGS:'Rejected Bags',ACCEPTED_QTY:'Accepted Quantity',AVG_MOISTURE:'QC Average Moisture',AVG_ULOADED_MOISURE:'Unload Average Moisture',SILO_ACCEPTED_QTY:'Silo Quantity',WAREHOUSE_ACCEPTED_QTY:'Warehouse Quantity'});
     
    }
    this.exportService.exportExcel(this.converted, this.fileName);
  }
  rekey(arr:any, lookup:any) {
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      for (var fromKey in lookup) {
        var toKey = lookup[fromKey];
        var value = obj[fromKey];
        // if (value) {
          obj[toKey] = value;
          delete obj[fromKey];
        // }
      }
    }
    return arr;
  }
}