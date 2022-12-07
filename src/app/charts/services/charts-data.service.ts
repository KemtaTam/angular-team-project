import { IParamsData } from './../charts.component'
import { Injectable } from '@angular/core'
import { ChartConfiguration } from 'chart.js'

import { IData1 } from './../../services/api.service'

export interface IChartWithOptions {
	title: string
	lineChartData: ChartConfiguration<'line'>['data']
}
export interface IAdditionalData {
	label: string
	data: number[]
	tension: number
	backgroundColor?: string
	borderColor?: string
}
export interface IChartEl {
	title: string
	dates: string[]
	additionalData: IAdditionalData[]
}
interface ILegendTitle {
	qty: string
}

type ChartType = 'general' | 'office' | 'wh'

@Injectable({
	providedIn: 'root'
})
export class ChartsDataService {
	private chartsData: IData1[] | null = []
	private uniqueWhIds: number[] = []
	private legendTitle: ILegendTitle = {
		qty: 'Количество'
	}
	private paramsData?: IParamsData

	chartsWithOptions: IChartWithOptions[] = []
	chartsWithSumOptions: IChartWithOptions[] = []

	constructor() {}

	setChartsData(data: IData1[], paramsData?: IParamsData) {
		this.chartsData = data
		this.uniqueWhIds = [...this.getUniqueId(this.chartsData)]
		if (paramsData) {
			this.paramsData = paramsData
			this.chartsWithSumOptions = this.configureDataToSum()
		} else {
			this.chartsWithOptions = this.configureData(this.uniqueWhIds)
		}
	}

	private getUniqueId(data: IData1[]): Set<number> {
		const uniqueIds = new Set<number>()
		for (const el of data) {
			uniqueIds.add(el.wh_id)
		}
		return uniqueIds
	}

	private configureData(uniqueIds: number[]): IChartWithOptions[] {
		const charts: IChartEl[] = []

		for (const id of uniqueIds) {
			let chartElData: IData1[] = []
			let additionalData: IAdditionalData[] = []
			const dates: string[] = []
			const unnecessaryKeys = ['office_id', 'dt_date', 'wh_id']

			//only this id
			chartElData = this.chartsData!.filter((dataEl) => dataEl.wh_id === id)

			//all dates with this id
			for (const el of chartElData) {
				dates.push(el.dt_date)
			}

			//keys that will be displayed on the chart
			let keys = Object.keys(chartElData[0]) //take the keys of any element
			for (const unnecessaryKey of unnecessaryKeys) {
				keys = keys.filter((el) => !el.includes(unnecessaryKey))
			}

			additionalData = this.createAdditionalData(keys, chartElData)

			//add configured data to resulting chart
			charts.push({
				//all elements have the same title accordingly we take any
				title: `wh_id № ${chartElData[0].wh_id}`,
				dates,
				additionalData
			})
		}

		return this.addOptionsToData(charts)
	}

	private configureDataToSum() {
		let chartElData: IData1[] = []
		const allDates = new Set<string>()
		const resultArr: IChartEl[] = []
		const unnecessaryKeys = ['office_id', 'dt_date', 'wh_id']
		let additionalData: IAdditionalData[] = []

		//data only with this id
		chartElData = this.chartsData!.filter((dataEl) => {
			return dataEl[this.paramsData?.type as keyof IData1] === Number(this.paramsData?.id)
		})

		//get unique date
		for (const el of chartElData) {
			allDates.add(el.dt_date)
		}

		//keys that will displayed on the chart
		let keys = Object.keys(chartElData[0]) //take the keys of any such element
		for (const unnecessaryKey of unnecessaryKeys) {
			keys = keys.filter((el) => !el.includes(unnecessaryKey))
		}

		additionalData = this.createAdditionalSumData(keys, allDates, chartElData)

		//add configured data to resulting chart
		resultArr.push({
			title: `${this.paramsData?.type} № ${this.paramsData?.id}`, //todo
			dates: [...allDates],
			additionalData
		})

		return this.addOptionsToData(resultArr)
	}

	private createAdditionalData(keys: string[], chartElData: IData1[]): IAdditionalData[] {
		const additionalData: IAdditionalData[] = []

		for (const key of keys) {
			const arrWithValuesOfThisKey: number[] = []

			for (const el of chartElData) {
				arrWithValuesOfThisKey.push(el[key as keyof IData1] as number)
			}

			additionalData.push({
				label: this.legendTitle[key as keyof ILegendTitle],
				data: arrWithValuesOfThisKey,
				tension: 0.5,
				backgroundColor: 'red',
				borderColor: 'red'
			})
		}

		return additionalData
	}

	private createAdditionalSumData(keys: string[], allDates: Set<string>, chartElData: IData1[]): IAdditionalData[] {
		const additionalData: IAdditionalData[] = []

		for (const key of keys) {
			const arrWithValuesOfThisKey: number[] = []

			for (const date of allDates) {
				//array with this date
				const dateFilters = chartElData.filter((el) => el.dt_date === date)

				const sumOfValuesWithThisDate = dateFilters.reduce(
					(a, chartDataEl) => a + (chartDataEl[key as keyof IData1] as number),
					0
				)
				arrWithValuesOfThisKey.push(sumOfValuesWithThisDate)
			}

			additionalData.push({
				label: key,
				data: arrWithValuesOfThisKey,
				tension: 0.5,
				backgroundColor: 'blue',
				borderColor: 'blue'
			})
		}

		return additionalData
	}

	private addOptionsToData(charts: IChartEl[]): IChartWithOptions[] {
		const chartsWithOptions: IChartWithOptions[] = []

		for (const chartEl of charts) {
			chartsWithOptions.push({
				title: chartEl.title,
				lineChartData: {
					labels: chartEl.dates,
					datasets: chartEl.additionalData
				}
			})
		}

		return chartsWithOptions
	}
}
