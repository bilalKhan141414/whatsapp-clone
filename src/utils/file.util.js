export default class FileUtil {
  constructor(file){
    this.file = file;
    this.extension = file.substring(file.lastIndexOf("."))

    this.getExtention = this.getExtention.bind(this);
    this.createPoster = this.createPoster.bind(this);
  }

  get Thumbnail() {
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(this.file);
    video.currentTime = 5;
    var canvas = document.createElement("canvas");
    canvas.width = 350;
    canvas.height = 200;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  }
}

