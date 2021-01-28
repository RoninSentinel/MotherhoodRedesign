
import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-motherhood-home',
  templateUrl: './motherhood-home.component.html',
  styleUrls: ['./motherhood-home.component.css']
})
export class MotherhoodHomeComponent implements OnInit {

  constructor() { 
    
    
  $(document).ready(function () {
  
      $('.first-button').on('click', function () {
    
        $('.animated-icon1').toggleClass('open');
      });
      $('.second-button').on('click', function () {
    
        $('.animated-icon2').toggleClass('open');
      });
      $('.third-button').on('click', function () {
    
        $('.animated-icon3').toggleClass('open');
      });
    });
  }


  ngOnInit(): void {
  }

}
