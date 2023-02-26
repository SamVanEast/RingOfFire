import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public mobile: boolean = false;
  game;
  gameId: string;



  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute) {
    this.eventListener();
  }

  checkGameCanStart() {
    if (this.game.players.length > 1) {
      this.game.gameCanStart = true;
    }
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.firestore.collection('games').doc(this.gameId).valueChanges().subscribe((game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCard = game.playedCard;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;
        this.game.gameCanStart = game.gameCanStart
      })
    });
  }

  newGame() {
    this.game = new Game();
    this.checkGameCanStart();
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.checkGameCanStart();
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.firestore.collection('games').doc(this.gameId).update(this.game.toJson());
  }


  eventListener() {
    if (window.innerWidth < 390) {
      this.mobile = true;
    }
    addEventListener("resize", (event) => {
      if (window.innerWidth < 390) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
  }
}
