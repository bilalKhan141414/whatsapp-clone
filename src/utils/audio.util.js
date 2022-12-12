import WaveSurfer from "wavesurfer.js";

const FFT_SIZE = 32,
  SMOOTHING_TIME_CONSTANT = 0;
async function sleep(ms) {
  return new Promise((r, rej) => setTimeout(() => r(true), ms));
}

function VisibleRectQueue() {
  const collection = [];
  this.print = function () {
    console.log(collection);
  };
  this.enqueue = function (element) {
    collection.push(element);
  };
  this.dequeue = function () {
    return collection.shift();
  };
  this.front = function () {
    return collection[0];
  };
  this.get = function (index) {
    return collection[index];
  };
  this.size = function () {
    return collection.length;
  };
  this.isEmpty = function () {
    return collection.length === 0;
  };
}
const milisecondsToTime = (milisecs) => {
  let secs = milisecs / 1000;
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  let obj = {
    h: hours,
    m: minutes,
    s: seconds,
    ms: milisecs,
  };
  return obj;
};
class ChatAudioCanvas {
  #canvas = document.getElementById("audio-canvas");
  #ctx = this.#canvas?.getContext("2d");
  #rectWidth = 2;
  #minRectHeight = 2;
  #rectColor = "#a5a5a5";
  canvasWidth = this.#canvas?.width ?? 1;
  canvasHeight = this.#canvas?.height ?? 1;

  get RectWidth() {
    return this.#rectWidth;
  }
  set RectWidth(value) {
    this.#rectWidth = value;
  }

  get MinRectHeight() {
    return this.#minRectHeight;
  }
  get Ctx() {
    return this.#ctx;
  }
  set Ctx(value) {
    this.#ctx = value;
  }

  constructor(rectWidth, rectColor) {
    this.#rectWidth = rectWidth ?? this.#minRectHeight;
    this.#rectColor = rectColor ?? "#a5a5a5";
  }
  init(data) {
    this.canvasWidth = data.canvas.width;
    this.canvasHeight = data.canvas.height;
    this.#canvas = data.canvas;
    this.#ctx = data.canvas?.getContext("2d");
  }
  clearRect = () => {
    this.#ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  };
  normalRect = (x, y, w, h) => {
    this.Ctx.moveTo(0, 0);
    this.Ctx.fillStyle = this.#rectColor;
    this.Ctx.fillRect(x, y, w, h);
    this.Ctx.fill();
  };
  roundedRect = (x, y, w, h, r = 3) => {
    this.Ctx.strokeStyle = this.#rectColor;
    this.Ctx.fillStyle = this.#rectColor;
    this.Ctx.beginPath();
    this.Ctx.roundRect(x, y, w, h, r);
    this.Ctx.stroke();
    this.Ctx.fill();
  };
}

class ChatAudioVissualizer extends ChatAudioCanvas {
  #totalVisibleFrams = 0;
  #dataArray = [];
  #changeInX = 0;
  #recorder = null;
  #visibleRectsWindow = new VisibleRectQueue();
  #x = this.canvasWidth;
  #isAnimateCalled = false;
  stopAnimation = false;

  get Recorder() {
    return this.#recorder;
  }
  set Recorder(value) {
    this.#recorder = value;
  }
  get IsRecording() {
    return !!this.#recorder;
  }
  get IsAnimateCalled() {
    return this.#isAnimateCalled;
  }
  set IsAnimateCalled(value) {
    this.#isAnimateCalled = value;
  }

  get DataArray() {
    return this.#dataArray;
  }
  set DataArray(value) {
    this.#dataArray = value;
  }

  constructor(rectWidth, rectColor) {
    super(rectWidth, rectColor);
    this.#changeInX = this.RectWidth + 2.5;
    this.#totalVisibleFrams = this.canvasWidth / this.#changeInX;
  }
  init(data) {
    super.init(data);
    this.#totalVisibleFrams = this.canvasWidth / this.#changeInX;
  }
  #calculateRectHeight = () => {
    let rectHeight = this.DataArray.pop() ?? this.MinRectHeight;
    const normalizeVal =
      (rectHeight - this.MinRectHeight) / (70 - this.MinRectHeight);

    return rectHeight <= this.MinRectHeight
      ? this.MinRectHeight
      : normalizeVal * (normalizeVal >= 4 ? 12 : normalizeVal >= 2 ? 7 : 4); // randomizing bar height in betweeen 12 and
  };
  #adjustFirstThreeRects = (i, size) => {
    const rectToDraw = this.#visibleRectsWindow.get(i);

    const isFirst = i === size - 1;
    const isSec = i === size - 2;
    const isThird = i === size - 3;

    let { y, height } = rectToDraw;
    const isNotMinimumRectHeight = height > this.MinRectHeight;

    if (isNotMinimumRectHeight && (isFirst || isSec || isThird)) {
      height = isFirst ? 3 : isSec ? 5 : 7;
      y = this.canvasHeight / 2 - height / 2;
    }
    return { y, height };
  };
  #resetXifIsZero = () => {
    if (this.#x <= 0) this.#x = this.canvasWidth;
  };
  animate = async () => {
    await sleep(100);
    this.clearRect();
    this.#resetXifIsZero();

    let rectHeight = this.#calculateRectHeight();

    let tempindex = this.#x;
    const { size, dequeue, enqueue } = this.#visibleRectsWindow;

    const visibleRectWindowSize = size();

    if (visibleRectWindowSize >= this.#totalVisibleFrams) {
      dequeue();
      tempindex = 0;
    }

    enqueue({
      x: this.#x,
      y: this.canvasHeight / 2 - rectHeight / 2,
      height: rectHeight,
    });

    for (let i = 0; i < visibleRectWindowSize; i++) {
      const { y, height } = this.#adjustFirstThreeRects(
        i,
        visibleRectWindowSize
      );

      this.roundedRect(tempindex, y, this.RectWidth, height);
      tempindex += this.#changeInX;
    }
    this.#x -= this.#changeInX;

    if (this.Recorder && !this.stopAnimation)
      requestAnimationFrame(this.animate);
    else this.IsAnimateCalled = false;
  };
}
export const initialAnalyserState = {
  time: {
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  },
  miliseconds: 0,
  recording: false,
  pauseRecord: false,
  medianotFound: false,
  audios: [],
  audioBlob: null,
  audioChunks: null,
  stream: null,
};
class ChatAudioAnalyser extends ChatAudioVissualizer {
  state = { ...initialAnalyserState };
  #noice = 100;
  orignalData = [];
  #pauseRecorder = null;
  #fpsOptions = { lastTimestamp: 0, maxFPS: 3, timestep: 1000 / 3 };
  init = (react) => {
    super.init({
      canvas: document.getElementById("audio-canvas"),
    });
    this.setRecorderStates = react.setRecorderStates;
  };
  startTimer() {
    // if (this.timer === 0 && this.state.seconds > 0) {
    this.timer = setInterval(this.countDown, 100);
    // }
  }

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    const miliseconds = this.state.miliseconds + 100;
    this.setState({
      time: milisecondsToTime(miliseconds),
      miliseconds: miliseconds,
    });
  };

  #ANALYSE = (stream) => {
    const CONTEXT = new AudioContext();
    const ANALYSER = CONTEXT.createAnalyser();

    ANALYSER.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;

    const SOURCE = CONTEXT.createMediaStreamSource(stream);
    ANALYSER.fftSize = FFT_SIZE;

    const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount);
    SOURCE.connect(ANALYSER);

    const REPORT = async (timestamp) => {
      if (this.Recorder && !this.state.pauseRecord)
        requestAnimationFrame(REPORT);
      else {
        CONTEXT.close();
        return;
      }

      //limiting FPS
      const { timestep, lastTimestamp } = this.#fpsOptions;
      if (timestamp - lastTimestamp < timestep) return;
      this.#fpsOptions.lastTimestamp = timestamp;

      ANALYSER.getByteFrequencyData(DATA_ARR);
      this.orignalData.push(DATA_ARR.buffer);
      let cleanData = DATA_ARR.filter((item) => item >= this.#noice); // all frequencies less than Noice are noice

      const threeByFourOfOriginalData = DATA_ARR.length - DATA_ARR.length / 3;
      const shouldUseOrignal = cleanData.length >= threeByFourOfOriginalData;

      cleanData = shouldUseOrignal ? DATA_ARR : cleanData;

      const shouldAdd = cleanData.length >= 3;
      if (shouldAdd) {
        this.DataArray = [...cleanData.reverse()];
      }

      if (!this.IsAnimateCalled) {
        this.IsAnimateCalled = true;
        requestAnimationFrame(this.animate);
      }
    };
    REPORT();
  };

  setState = (data) => {
    this.state = {
      ...this.state,
      ...data,
    };
    this.setRecorderStates(this.state);
  };

  toggleRecording = async () => {
    if (!this.Recorder) {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      // Reset the audio tag
      const CHUNKS = [];
      const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.Recorder = new MediaRecorder(MEDIA_STREAM);
      this.#initPauseRecorder();
      this.Recorder.ondataavailable = (event) => {
        this.Recorder = null;
        CHUNKS.push(event.data);
        // const AUDIO_BLOB = new Blob(CHUNKS, { type: "audio/mp3" });
        // this.setState({
        //   audioBlob: AUDIO_BLOB,
        // });
      };
      this.#pauseRecorder.start();
      this.Recorder.start();
      this.startTimer();
      this.#ANALYSE(this.Recorder.stream);
    } else {
      this.setState({ time: {} });
      clearInterval(this.timer);
      this.Recorder.stream.getTracks().forEach((t) => t.stop());
      this.Recorder.stop();
      this.setState({ recording: false, pauseRecord: false });
      this.Recorder = null;
    }
  };
  #initPauseRecorder = () => {
    this.#pauseRecorder = new MediaRecorder(this.Recorder.stream);
    const paushChunks = [];
    this.#pauseRecorder.ondataavailable = (event) => {
      paushChunks.push(event.data);
      const AUDIO_BLOB = new Blob(paushChunks, { type: "audio/mp3" });
      this.setState({
        audios: paushChunks,
        audioBlob: AUDIO_BLOB,
      });
    };
  };
  handleAudioPause = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    clearInterval(this.timer);
    this.Recorder.pause();
    this.#pauseRecorder.stop();
    this.setState({ pauseRecord: true });
    this.stopAnimation = true;
  };

  handleAudioResume = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    this.startTimer();
    this.#initPauseRecorder();
    this.#pauseRecorder.start();
    this.Recorder.resume();
    this.setState({ pauseRecord: false });
    this.stopAnimation = false;
    this.#ANALYSE(this.Recorder.stream);
  };

  saveAudio = (chunks) => {
    // convert saved chunks to blob
    const blob = new Blob(chunks, { type: "audio/mp3" });
    // generate video url from blob
    const audioURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    this.react?.handleAudioStop({
      url: audioURL,
      blob: blob,
      chunks: this.chunks,
      duration: this.state.time,
    });
  };

  handleReset = (e) => {
    if (this.Recorder) {
      this.toggleRecording(e);
    }
    this.setState(
      {
        time: {},
        miliseconds: 0,
        recording: false,
        medianotFound: false,
        audios: [],
        audioBlob: null,
      },
      () => {
        this.react?.handleReset(this.state);
      }
    );
  };
}
const chatAudioAnalyser = new ChatAudioAnalyser();
export default chatAudioAnalyser;
class AudioGraphLoader {
  wavesurfer = null;
  time = {
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  };
  playingIntId = null;
  async init(audioBlob, react) {
    this.wavesurfer = WaveSurfer.create({
      container: "#audioPreview",
      waveColor: "#dce2e5",
      progressColor: "#a5a5a5",
      barWidth: 2,
      responsive: true,
      height: 40,
      barRadius: 2,
      barMinHeight: 1.5,
      barGap: 2,
    });
    this.isPlaying = this.wavesurfer.isPlaying;
    this.destroy = this.wavesurfer.destroy;

    this.wavesurfer.loadBlob(audioBlob);
    this.setTimer = react.setTimer;
    const loadedAudio = await audioBlob.arrayBuffer();

    const audioContext = new AudioContext();
    const decodedAudio = await audioContext.decodeAudioData(loadedAudio);
    window.decodedAudio1 = decodedAudio;

    const totalDuration = decodedAudio.duration * 1000;
    this.setTimer(milisecondsToTime(Math.floor(totalDuration)));
  }

  togglePlay = () => {
    this.wavesurfer.playPause();
    if (this.wavesurfer.isPlaying()) {
      this.#getDuration();
    } else {
      clearInterval(this.playingIntId);
    }
  };

  #getDuration = () => {
    const totalDuration = this.wavesurfer.getDuration() * 1000;
    let lastSecond = null;
    this.setTimer(milisecondsToTime(Math.floor(totalDuration)));
    this.playingIntId = setInterval(() => {
      const currentSeconds = this.wavesurfer.getCurrentTime() * 1000;

      if (lastSecond !== currentSeconds) {
        const timeDiff = Math.floor(totalDuration) - Math.floor(currentSeconds);
        const time = milisecondsToTime(timeDiff);
        this.setTimer(time);
        lastSecond = currentSeconds;
      }

      if (!this.wavesurfer.isPlaying()) {
        clearInterval(this.playingIntId);
      }
    }, 1000);
  };
}
export const audioGraphLoader = new AudioGraphLoader();
