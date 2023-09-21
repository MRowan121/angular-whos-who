import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from "./Components/settings/settings.component";
import { GameComponent } from "./game/game.component";
import { TrackComponent } from "./Components/track/track.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "game", component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    GameComponent,
    TrackComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
