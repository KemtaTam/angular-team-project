import { Component, ElementRef, ViewChild } from '@angular/core';
import {
	Chart,
	ChartTypeRegistry,
	ScatterDataPoint,
	registerables,
} from 'chart.js';

@Component({
  selector: 'app-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.scss']
})
export class ChartItemComponent {
	isFull = false;
	chart!: Chart<
		keyof ChartTypeRegistry,
		(number | ScatterDataPoint | null)[],
		unknown
	>;

	@ViewChild('chartWrapper') chartWrapper!: ElementRef;
	@ViewChild('canvas') canvas!: ElementRef;
}
