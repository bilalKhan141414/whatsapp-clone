/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { audioGraphLoader } from "../../../../utils/audio.util";
import { PlayIcon } from "../icons/play-icon";
import { getMinutes, getSeconds } from "./audio-recorder-util";

export const AudioRecorderPreview = ({ showPreview, audioBlob }) => {
  const [{ m, s }, setTimer] = useState({
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  });
  useEffect(() => {
    return () => {
      audioGraphLoader.destroy();
    };
  }, []);

  useEffect(() => {
    if (audioBlob) {
      audioGraphLoader.init(audioBlob, {
        setTimer,
      });
    }
  }, [audioBlob]);

  return (
    <div
      className={`${
        !showPreview ? "hidden" : " w-52"
      } flex items-center gap-2 rounded-xl  border-grey-100 px-2`}>
      <PlayIcon
        isPlaying={audioGraphLoader?.wavesurfer?.isPlaying?.()}
        handleClick={audioGraphLoader?.togglePlay}
      />
      <div id='audioPreview' className={`relative block w-40 h-10 `}></div>
      <span
        className={`block text-gray-400 font-medium tracking-wide  text-sm`}>
        {getMinutes(m)}:{getSeconds(s)}
      </span>
    </div>
  );
};
