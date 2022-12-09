import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
	{
		path: 'charts',
		loadChildren: () => import("./charts/charts.module").then(m => m.ChartsModule)
	},
	{
		path: 'main-content',
		loadChildren: () => import("./table/table.module").then(m => m.TableModule)
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'main-content'
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
