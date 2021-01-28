import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { SquadronTemplateComponent} from '../squadron-template.component';

import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-squadron-header',
  templateUrl: './squadron-header.component.html',
  styleUrls: ['./squadron-header.component.css'],
})
export class SquadronHeaderComponent implements OnInit {
  currentTime: string;
  time = new Date();
  timer;
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

    
  } //end constructor
  
  ngOnInit() {
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

}
