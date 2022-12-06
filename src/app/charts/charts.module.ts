
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChartsComponent } from './charts.component';
import { ChartItemComponent } from './chart-item/chart-item.component';

@NgModule({
	declarations: [ChartsComponent, ChartItemComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'charts', component: ChartsComponent}
		])
	],
	exports: [
		ChartsComponent
	]
})
export class ChartsModule {}