import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService, UserService, User, AlertService } from '../shared';
//import * as jsPDF from 'jspdf';
declare var jsPDF: any;
import * as faker from 'faker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  subscription: Subscription = new Subscription();
  // chart = [];
  canvas: any;
  ctx: any;
  @ViewChild('content') content: ElementRef;

  constructor(private alertService:AlertService) { }

  ngOnInit() {}

  /**
   * Because you need to get the canvas from the DOM
   * you need to make sure it's rendered before attempting to access it. This
   * can be accomplished with AfterViewInit.
   */
  ngAfterViewInit() {
    this.alertService.info('The Dashboard is currently in development and will feature summarys in form of graphs. Coming soon.');

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

    const config = {
      type: 'line',
      data: {
          labels: ['January', 'February', 'March'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'red',
              borderColor: 'red',
              data: [
                '10',
                '25',
                '18',
              ],
              fill: false,
            },
            {
              label: 'My Second dataset',
              fill: false,
              backgroundColor: 'blue',
              borderColor: 'blue',
              data: [
                '9',
                '27',
                '17',
              ],
            }
        ]
      },
      options: {
        responsive: false,
        title: {
            display: true,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Month'
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Value'
              }
            }
          ]
        }
      }
    };
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const chart = new Chart(this.ctx, config);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
