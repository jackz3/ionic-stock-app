import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule) },
  { path: 'modify', loadChildren: () => import('./pages/modify/modify.module').then(m => m.ModifyPageModule) },
  { path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule) },
  { path: 'details/:code', loadChildren: () => import('./pages/details/details.module').then(m => m.DetailsPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
