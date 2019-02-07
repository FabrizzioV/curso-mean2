import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
	public titulo: string;
	public album:Album;
	public identity;
	public token;
	public song: Song
	public alertMessage;
	public url:string;
	public is_edit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _uploadService: UploadService,
		private _userService: UserService,
		private _songService: SongService
	){
		this.titulo = 'Editar la canción';
		this.identity=this._userService.getIdentity();
		this.token=this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');
		this.is_edit = true;
	}
	
	ngOnInit(){
		this.getSong();
	}

	getSong(){
		this._route.params.forEach((params: Params) =>{
			let id=params['id'];
			this._songService.getSong(this.token, id).subscribe(
				response=>{
					if(!response.song){
						this._router.navigate(['/'])
					}else{
						this.song = response.song;
					}
				},
				error =>{
					var errorMessage = <any>error;
					if(errorMessage != null){
					  	var body = JSON.parse(error._body);
					  	this.alertMessage= body.message;
						console.log(error);
					}
				}
			);
		});
	}

	onSubmit(){
		this._route.params.forEach((params: Params) =>{
			let id=params['id'];

			this._songService.editSong(this.token, id, this.song).subscribe(
				response => {
					if(!response.song){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = 'La canción se ha creado correctamente'
						if(!this.filesToUpload){
						
						}else{
							this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
							.then(
								(result) => {
									this._router.navigate(['/album', response.song.album]);
								},
								(error) => {
									console.log(error);
								}
							);					
						}
					}
				},
				error =>{
					var errorMessage = <any>error;
					if(errorMessage != null){
					  	var body = JSON.parse(error._body);
					  	this.alertMessage= body.message;
						console.log(error);
					}
				}
			);
		});
	}
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}