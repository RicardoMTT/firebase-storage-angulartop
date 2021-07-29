import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudService } from './cloud.service';
import { catchError, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-cloud-storage';
  imagenURL;
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });
  public URLPublica = '';
  public finalizado = false;
  public isLoading = false;

  filePath;
  constructor(private storage: AngularFireStorage) {}

  public selectedFile: File;
  chooseFile(event) {
    this.selectedFile = event.target.files;
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result); //imagen en base 64

      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file); //usado para leer el contenido del especificado Blob o File.
    /*
    En ese momento, el atributo result contiene  la información como una URL representando la información del archivo como una cadena de caracteres codificados en base64
    */
  }

  uploadImage() {
    this.isLoading = true;
    const file = this.selectedFile[0];
    const key =
      'uploads/' + '/' + Math.floor(Math.random() * 1000000) + file.name;
    const upload = this.storage.upload(key, file).then(() => {
      const ref = this.storage.ref(key);
      const downloadURL = ref.getDownloadURL().subscribe((url) => {
        console.log('url', url);
        this.finalizado = true;
        this.URLPublica = url;
        this.imagenURL = url;
        this.isLoading = false;
      });
    });
  }
}
