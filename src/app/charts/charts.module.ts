import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChartRoutingModule } from './chart-routing.module';
import { ChartItemComponent } from './chart-item/chart-item.component'
import { ChartsComponent } from './charts.component'
import { SharedModule } from './../shared/shared.module'

@NgModule({
	declarations: [ChartsComponent, ChartItemComponent],
	imports: [CommonModule, 
		SharedModule,
		ChartRoutingModule
	],
})
export class ChartsModule {}
