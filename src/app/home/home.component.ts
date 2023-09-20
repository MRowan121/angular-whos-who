import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from "@angular/router";
import { set } from "lodash";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

interface Setting {
  name: string;
  amount: number;
  min: number;
  max: number;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  game: any = {
    rounds: [],
    incorrectSongs: [],
  };
  settings: Setting[] = [
    {
      name: "Number of Rounds: ",
      amount: 1,
      min: 1,
      max: 3,
    },
    {
      name: "Options per Round: ",
      amount: 2,
      min: 2,
      max: 4,
    },
  ];
  constructor(private router: Router) {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }

  increment(settingName: string) {
    HomeComponent.bind(this);
    if (this.settings.find((setting) => setting.name === settingName)) {
      this.settings.map((setting) => {
        if (setting.name === settingName) {
          setting.amount < setting.max ? (setting.amount += 1) : setting.amount;
        }
      });
    }
  }

  decrement(settingName: string) {
    HomeComponent.bind(this);
    if (this.settings.find((setting) => setting.name === settingName)) {
      this.settings.map((setting) => {
        if (setting.name === settingName) {
          setting.amount > setting.min ? (setting.amount -= 1) : setting.amount;
        }
      });
    }
  }

  createSearch() {
    const randomIndex = Math.floor(Math.random() * 200);
    const query =
      "search?query=genre%3A" +
      this.selectedGenre +
      "&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=" +
      randomIndex +
      "&limit=1";
    return query;
  }

  createGame = async (t: any) => {
    const response = await fetchFromSpotify({
      token: t,
      endpoint: this.createSearch(),
    });
    console.log(response.tracks);
  };

  goToGame() {
    this.createGame(this.token);
    this.router.navigate(["/game"]);
  }
}
