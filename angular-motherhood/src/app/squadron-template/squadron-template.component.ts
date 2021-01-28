import { Component, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery';
import {SquadronHeaderComponent} from './squadron-header/squadron-header.component';



@Component({
  selector: 'app-squadron-template',
  templateUrl: './squadron-template.component.html',
  styleUrls: ['./squadron-template.component.css']
})
export class SquadronTemplateComponent implements OnInit {
  defaultStyle = true;
  constructor() { }

  ngOnInit(): void {
  }
  bgColor = 'linear-gradient(rgb(10, 10, 10), rgb(177, 1, 1))';

  changeColor(){
    this.bgColor = 'linear-gradient(rgb(10, 10, 10), rgb(177, 1, 1))';
  }
  
}
