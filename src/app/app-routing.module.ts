import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: 'charts',
		loadChildren: () => import('./charts/charts.module').then((m) => m.ChartsModule)
	},
	{
		path: 'table',
		loadChildren: () => import('./table/table.module').then((m) => m.TableModule)
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'table'
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
