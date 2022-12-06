import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TableModule } from './modules/table/table.module'

const routes: Routes = [
	{
		path: 'table',
		loadChildren: () => TableModule
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
