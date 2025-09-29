import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

export class Abc{
  ID:number = 0;
  NAME:any;
  COLLEG_NAME:any;
}
@Component({
  selector: 'app-fit-book',
  templateUrl: './fit-book.component.html',
  styleUrls: ['./fit-book.component.css']
})
export class FitBooksComponent implements OnInit {


  INNERTABLEDATA:any = new Abc()
  data2:any = new Abc()
  index = -1;
  Items:any[] = [];
  totaldata = 1;

  constructor() { }

  ngOnInit(): void {
  }
  addData( form2: NgForm) {

    
    this.INNERTABLEDATA = {

      ID: this.data2.ID,
      NAME: this.data2.NAME,
      COLLEG_NAME: this.data2.COLLEG_NAME
    }

    if(this.index > 1)
    {
      this.Items[this.index] = this.INNERTABLEDATA

    }else{
      this.Items.push(this.INNERTABLEDATA)

    }

    
    this.totaldata = this.Items.length;

    this.index = -1
  }

  edit(data2,i)
  {
    this.index = i;

    
    this.data2 = Object.assign({},data2)
  }
}

