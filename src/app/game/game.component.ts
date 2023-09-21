import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";
import { Artist } from "../home/home.component";

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
    console.log("Genre: " + this.selectedGenre);
    console.log("Game Array: ", this.gameArray);
    console.log("Num of Songs: " + this.numOfSongs);
    console.log("Num of Artists: " + this.numOfArtists);
  }

  goHome() {
    this.router.navigate(["/"]);
  }
}
