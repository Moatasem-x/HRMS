import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-modern',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-modern.html',
  styleUrls: ['./dashboard-modern.css']
})
export class DashboardModernComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Income Statistics Line Chart
    new Chart('incomeChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Income',
            data: [4000, 6000, 9000, 10500, 8000, 7000, 6500, 9000, 9500, 10000, 11000, 11500],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            tension: 0.4,
            fill: true,
            pointRadius: 3
          },
          {
            label: 'Expense',
            data: [2000, 2500, 3000, 3200, 3500, 4000, 3280, 4000, 4200, 4300, 4500, 4700],
            borderColor: '#f59e42',
            backgroundColor: 'rgba(245,158,66,0.08)',
            tension: 0.4,
            fill: true,
            pointRadius: 3
          }
        ]
      },
      options: {
        plugins: { legend: { display: true } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f3f3' } },
          x: { grid: { color: '#f3f3f3' } }
        }
      }
    });

    // Employee Performance Ratings Horizontal Bar Chart
    new Chart('performanceChart', {
      type: 'bar',
      data: {
        labels: ['Hazel Nutt', 'Simon Cyrene', 'Aida Bugg', 'Peg Legge', 'Barb Akew'],
        datasets: [
          {
            label: 'Task completed',
            data: [38, 32, 28, 25, 20],
            backgroundColor: '#3b82f6',
            borderRadius: 8,
            barPercentage: 0.5
          },
          {
            label: 'Presence',
            data: [35, 30, 25, 22, 18],
            backgroundColor: '#66bb6a',
            borderRadius: 8,
            barPercentage: 0.5
          },
          {
            label: 'Completed Meeting',
            data: [30, 28, 20, 18, 15],
            backgroundColor: '#f59e42',
            borderRadius: 8,
            barPercentage: 0.5
          }
        ]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: true } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true, grid: { color: '#f3f3f3' } },
          y: { grid: { color: '#f3f3f3' } }
        }
      }
    });
  }
} 