import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Artist } from "src/app/home/home.component";

@Injectable({
  providedIn: "root",
})
export class GameService {
  /* Behavior subjects are similar to React state. We provide 
  it with a type (Artist[]) & a default value of []. */
  private artistsArraySource = new BehaviorSubject<Artist[]>([]);
  /* Observables allow you to subscribe to the artistArray 
  and observe any changes that take place */
  artistsArray = this.artistsArraySource.asObservable();

  /* We will take in an array of artists, call on the behavior 
  subject (this.artistsArraySource), & when we call .next(), it 
  essentially updates the value with the value thats being passed in */
  updateArtistsArray(artists: Artist[]) {
    this.artistsArraySource.next(artists);
  }

  private selectedGenreSource = new BehaviorSubject<String>("");
  selectedGenre = this.selectedGenreSource.asObservable();
  updateSelectedGenre(genre: String) {
    this.selectedGenreSource.next(genre);
  }

  private totalSongsSource = new BehaviorSubject<number>(0);
  totalSongs = this.totalSongsSource.asObservable();
  updateTotalSongs(totalSongs: number) {
    this.totalSongsSource.next(totalSongs);
  }

  private totalArtistsSource = new BehaviorSubject<number>(0);
  totalArtists = this.totalArtistsSource.asObservable();
  updateTotalArtists(totalArtists: number) {
    this.totalArtistsSource.next(totalArtists);
  }
}
