import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { Chart, ChartTypeRegistry, ScatterDataPoint, registerables } from 'chart.js'

import { IChartWithOptions } from './../services/charts-data.service';

@Component({
	selector: 'app-chart-item',
	templateUrl: './chart-item.component.html',
	styleUrls: ['./chart-item.component.scss']
})
export class ChartItemComponent {
	isFull = false
	chart!: Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | null)[], unknown>

	@Input() chartItem!: IChartWithOptions

	@ViewChild('chartWrapper') chartWrapper!: ElementRef
	@ViewChild('canvas') canvas!: ElementRef

	constructor() {
		Chart.register(...registerables);
	}

	ngAfterViewInit(): void {
		this.createChart();
	}

	createChart() {
		this.chart = new Chart(this.canvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.chartItem.lineChartData.labels,
				datasets: this.chartItem.lineChartData.datasets
			}
		})
	}

	fullScreenHandler(): void {
		const chart = this.chartWrapper.nativeElement

		if (!this.isFull) {
			this.isFull = true
			chart.closest('body').style.overflow = 'hidden'
		} else {
			this.isFull = false
			chart.closest('body').style.overflow = 'auto'
		}
	}
}
