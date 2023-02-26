import { Component } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {


  constructor(private router: Router, private firestore: AngularFirestore ) { }


  newGame() {
    let game = new Game();
    this.firestore.collection('games').add(game.toJson()).then((gameInfos: any) => { 
      console.log(gameInfos);
      this.router.navigateByUrl('/game/' + gameInfos['id']);
    });
  }
}
