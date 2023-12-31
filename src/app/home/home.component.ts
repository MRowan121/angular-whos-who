import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from "@angular/router";
import { set } from "lodash";
import { GameService } from "src/services/game.service";
import { sampleData } from "../sampledata";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

interface Setting {
  name: string;
  amount: number;
  min: number;
  max: number;
}



export interface Track {
  trackName: string;
  trackPreview: string;
}

export interface Artist {
  artistId: string;
  artistName: string;
  artistImage: string;
  artistTracks: Track[];
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  settings: Setting[] = [
    {
      name: "Songs per Guess: ",
      amount: 1,
      min: 1,
      max: 3,
    },
    {
      name: "Artists per Guess: ",
      amount: 2,
      min: 2,
      max: 4,
    },
  ];
  
  constructor(private gameData: GameService, private router: Router) {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  artistArray: Artist[] = [];
  numofSongs: number = 1;
  

  ngOnInit(): void {  
    const savedUserSettings = localStorage.getItem("userSettings");
    if (savedUserSettings) {
      let userSettings = JSON.parse(savedUserSettings);
      this.selectedGenre = userSettings.genre;
      this.settings[0].amount = userSettings.songs;
      this.settings[1].amount = userSettings.artists;
    }
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
    localStorage.setItem('genre', selectedGenre)
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
    const query =
      "search?query=genre%3A" +
      this.selectedGenre +
      "&type=artist&locale=en-US%2Cen%3Bq%3D0.9&limit=50";
    return query;
  }

  /* The parameter is a union type so that the function can 
  correctly shuffle artistTracks in addition to artists */
  shuffleArray(array: Artist[] | Track[]) {
    array.sort(() => 0.5 - Math.random());
  }

  fetchArtists = async (t: any) => {
    const response = await fetchFromSpotify({
      token: t,
      endpoint: this.createSearch(),
    });
    this.artistArray = response.artists.items.map((artist: any) => {
      return {
        artistId: artist.id,
        artistName: artist.name,
        artistImage: artist?.images[0].url,
        artistTracks: [],
      };
    });
  };

  fetchTracks = async (t: any) => {
    for (const artist of this.artistArray) {
      const response = await fetchFromSpotify({
        token: t,
        endpoint: `artists/${artist.artistId}/top-tracks?market=US`,
      });
      artist.artistTracks = response.tracks
        .map((track: any) => {
          return {
            trackName: track.name,
            trackPreview: track.preview_url,
          };
        })
        .filter((obj: any) => obj.trackPreview !== null);
      this.shuffleArray(artist.artistTracks);
    }
    this.validateArtists();
  };

  validateArtists() {
    this.artistArray = this.artistArray.filter(
      (artist) => artist.artistTracks.length >= 3
    );
  }

  updateGameService() {
    let numOfArtists = this.settings[1].amount;
    this.gameData.updateSelectedGenre(this.selectedGenre);
    this.gameData.updateArtistsArray(this.artistArray.slice(0, numOfArtists));
    this.gameData.updateTotalSongs(this.settings[0].amount);
    this.gameData.updateTotalArtists(numOfArtists);
  }

  createGame = async (t: any) => {
    await this.fetchArtists(t);
    await this.fetchTracks(t);
    this.shuffleArray(this.artistArray);
    this.updateGameService();
  };

  async goToGame() {
    await this.createGame(this.token);
    const config = {
      genre: this.selectedGenre,
      songs: this.settings[0].amount,
      artists: this.settings[1].amount,
      totalArtists: this.artistArray.length
    };
    localStorage.setItem("userSettings", JSON.stringify(config));
    this.router.navigate(["/game"]);
  }


}
