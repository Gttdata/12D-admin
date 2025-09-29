import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-allreporttiles',
  templateUrl: './allreporttiles.component.html',
  styleUrls: ['./allreporttiles.component.css'],
})
export class AllreporttilesComponent implements OnInit {
  title = 'View Reports';
  menus = [];
  reports = [];
  erpreports = [];
  userreports = [];
  healthandfitnessreports = [];
  trackbookreports = [];
  roleId = Number(sessionStorage.getItem('roleId'));
  currentroute = '';

  constructor(private api: LoginserviceService, private router: Router) {
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }
  screenWidth = 0;
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
  }
  ngOnInit(): void {
    this.getReports();
    this.screenWidth = window.innerWidth;
  }
  getReports() {
    this.reports = [];
    this.api.getForms(this.roleId).subscribe((data) => {
      if (data['code'] == 200) {
        this.menus = data['data'];
        this.menus.forEach((data) => {
          // console.log(data);
          if (this.roleId == 6 || this.roleId == 1) {
            // else{
            data.children.forEach((data2) => {
              // console.log(data);
              if (
                data2.title.toLowerCase().includes('reports') ||
                data2.title.toLowerCase().includes('report') ||
                data2.title.toLowerCase().includes('summary') ||
                data2.title.toLowerCase().includes('detailed') ||
                data2.title.toLowerCase().includes('details')
              ) {
                if (data.title == 'ERP Reports') {
                  this.erpreports.push(data2);
                } else if (data.title == 'User Reports') {
                  this.userreports.push(data2);
                } else if (data.title == 'Health And Fitness Reports') {
                  this.healthandfitnessreports.push(data2);
                } else if (data.title == 'Trackbook Reports') {
                  this.trackbookreports.push(data2);
                } else {
                  this.reports.push(data2);
                }
              }
            });
            // }
            // }
          } else if (this.roleId == 2 || this.roleId == 1) {
            if (data.title.includes('Reports')) {
              console.log('data', data);
              console.log('data.children', data.children);

              this.reports = data.children.sort((a, b) => {
                return a.SEQ_NO - b.SEQ_NO;
              });
              console.log('this.reports ', this.reports);
            }
          }
        });
      } else {
        this.menus = [];
      }
    });
  }
}
