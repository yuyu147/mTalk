import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

import { FEATURE_NAME, reducers } from './examples.state';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';
import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
import { ParentComponent } from './theming/parent/parent.component';
import { FormComponent } from './form/components/form.component';
import { FormEffects } from './form/form.effects';
import { NotificationsComponent } from './notifications/components/notifications.component';
import { ExamplesEffects } from './examples.effects';
import { InfoComponent } from './info/info.component';
import { SettingsModule } from '../settings';


@NgModule({
  imports: [
    SettingsModule,
    SharedModule,
    ExamplesRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      ExamplesEffects,
      FormEffects
    ])
  ],
  declarations: [
    ExamplesComponent,
    StockMarketContainerComponent,
    ParentComponent,
    FormComponent,
    NotificationsComponent,
    InfoComponent
  ],
  providers: []
})
export class ExamplesModule {
  constructor() { }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/person/`,
    '.json'
  );
}
