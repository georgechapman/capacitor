import { WebPlugin } from './index';

import {
  CameraPreviewPlugin,
  CameraPhoto,
  CameraPreviewOptions
} from '../core-plugin-definitions';

//import '@ionic/pwa-elements';

export class CameraPreviewPluginWeb extends WebPlugin implements CameraPreviewPlugin {
  constructor() {
    super({
      name: 'CameraPreview',
      platforms: ['web']
    });
  }

  async getPhoto(options: CameraPreviewOptions): Promise<CameraPhoto> {
    options;

    return new Promise<CameraPhoto>(async (resolve, reject) => {
      const cameraModal: any = document.createElement('ion-pwa-camera-modal');
      document.body.appendChild(cameraModal);
      await cameraModal.componentOnReady();
      cameraModal.addEventListener('onPhoto', async (e: any) => {
        const photo = e.detail;

        if (photo === null) {
          reject();
        } else {
          resolve(await this._getCameraPhoto(photo));
        }

        cameraModal.dismiss();
      });

      cameraModal.present();
    });
  }

  private _getCameraPhoto(photo: Blob) {
    return new Promise<CameraPhoto>((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = () => {
        const r = reader.result as string;
        resolve({
          base64Data: r,
          webPath: r,
          format: 'jpeg'
        });
      };
      reader.onerror = (e) => {
        reject(e);
      };
    });
  }
}

const CameraPreview = new CameraPreviewPluginWeb();

export { CameraPreview };
