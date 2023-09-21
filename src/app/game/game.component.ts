import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";
import { Artist, Track } from "../home/home.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  selectedGenre: String = "";
  gameArray: Artist[] = [];
  numOfSongs: number = 0;
  numOfArtists: number = 0;
  selectedSongs: Track[] = [];
  correctAnswer: string = "";
  activeTrackIndex: number | null = null;

  constructor(private gameData: GameService, private router: Router) {}

  ngOnInit() {
    this.gameData.selectedGenre.subscribe(
      (genre) => (this.selectedGenre = genre)
    );
    this.gameData.artistsArray.subscribe(
      (artists) => (this.gameArray = artists)
    );
    this.gameData.totalSongs.subscribe((songs) => (this.numOfSongs = songs));
    this.gameData.totalArtists.subscribe(
      (number) => (this.numOfArtists = number)
    );
    // Creating the data that will populate play buttons below.
    this.selectedSongs = this.gameArray[0].artistTracks.slice(
      0,
      this.numOfSongs
    );
    this.correctAnswer = this.gameArray[0].artistName;
    this.activeTrackIndex = -1;
  }

  toggleActive(index: number) {
    if (this.activeTrackIndex === index) {
      this.activeTrackIndex = -1;
    } else {
      this.activeTrackIndex = index;
    }
  }

  goHome() {
    this.router.navigate(["/"]);
  }
}
