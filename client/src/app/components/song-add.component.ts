import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
	public titulo: string;
	public album:Album;
	public identity;
	public token;
	public song: Song
	public alertMessage;
	public url:string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService
	){
		this.titulo = 'Agregar nueva canción';
		this.identity=this._userService.getIdentity();
		this.token=this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');		
	}
	
	ngOnInit(){
	}
	onSubmit(){
		this._route.params.forEach((params: Params) =>{
			let album_id=params['album'];
			this.song.album= album_id;

			this._songService.addSong(this.token, this.song).subscribe(
				response => {
					if(!response.song){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'La canción se ha creado correctamente'
						this.song = response.song;
						console.log(this.song);
						this._router.navigate(['/edit-song', response.song._id]);
					}
				},
				error =>{
					var errorMessage = <any>error;
					if(errorMessage != null){
						console.log(error);
					}
				}
			);
		});
	}
}