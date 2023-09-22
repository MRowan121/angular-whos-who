import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";
import { Artist, Track } from "../home/home.component";
import { Howler } from "howler";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  gameArray: Artist[] = [];
  numOfSongs: number = 0;
  numOfArtists: number = 0;
  selectedSongs: Track[] = [];
  correctAnswer: string = "";
  activeTrackIndex: number | null = null;
  gameOver: boolean = false;
  winner: boolean = false;
  clickable: boolean = true;

  constructor(private gameData: GameService, private router: Router) {}

  ngOnInit() {
    this.gameData.artistsArray.subscribe(
      (artists) => (this.gameArray = artists)
    );
    this.gameData.totalSongs.subscribe((songs) => (this.numOfSongs = songs));
    this.gameData.totalArtists.subscribe(
      (number) => (this.numOfArtists = number)
    );
    this.selectedSongs = this.gameArray[0].artistTracks.slice(
      0,
      this.numOfSongs
    );
    this.correctAnswer = this.gameArray[0].artistName;
  }

  toggleActive(index: number) {
    this.activeTrackIndex = this.activeTrackIndex === index ? null : index;
  }

  checkCorrectArtist(artist: Artist) {
    this.gameOver = true;
    this.clickable = false;
    this.winner = artist.artistName === this.correctAnswer ? true : false;
  }

  goHome() {
    Howler.stop();
    this.router.navigate(["/"]);
  }
}
