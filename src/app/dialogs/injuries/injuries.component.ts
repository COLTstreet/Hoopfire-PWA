import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare var jQuery: any;


@Component({
  selector: 'app-injuries',
  templateUrl: './injuries.component.html',
  styleUrls: ['./injuries.component.scss']
})
export class InjuriesComponent implements OnInit {

  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };


  constructor(public _dataService: DataService, public dialogRef: MatDialogRef<InjuriesComponent> , @Inject(MAT_DIALOG_DATA) public data: any) { 

  }

  ngOnInit(): void {
    console.log(this.data.injuries);
  }

  getHeightFormatted(d: any) {
    var feet = Math.floor(d.Height / 12)
    var inches = d.Height % 12;
    return feet + "'" + inches;
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

}
