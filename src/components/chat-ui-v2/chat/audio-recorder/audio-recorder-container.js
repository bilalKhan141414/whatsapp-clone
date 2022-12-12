/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useChatContext } from "../../../../shared/custom-hooks/useChatContext";
import chatAudioAnalyser, {
  initialAnalyserState,
} from "../../../../utils/audio.util";
import { DeleteIcon } from "../icons/delete-icon";
import { PauseIcon } from "../icons/pause-icon";
import { SpeakerIcon } from "../icons/speaker-icon";
import { AudioRecorderPreview } from "./audio-recorder-preview";
import { getMinutes, getSeconds } from "./audio-recorder-util";

export const AudioRecorderContainer = () => {
  const [recorderStates, setRecorderStates] = useState(initialAnalyserState);
  const [{ m, s }, setTimer] = useState({
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  });

  const { toggleRecording } = useChatContext();

  useEffect(() => {
    chatAudioAnalyser.init({ setRecorderStates });
    chatAudioAnalyser.toggleRecording();
    return () => {
      chatAudioAnalyser.handleReset();
    };
  }, []);

  useEffect(() => {
    recorderStates?.time && setTimer(recorderStates?.time);
  }, [recorderStates?.time?.s]);
  useEffect(() => {
    return () => {};
  }, [recorderStates.audioBlob]);

  const handleAudioDelete = () => toggleRecording();
  const showPreview = recorderStates?.pauseRecord;
  return (
    <div className='items-center flex gap-3'>
      <DeleteIcon handleClick={handleAudioDelete} />
      <span className={`text-gray-400 font-medium tracking-wide`}>
        {getMinutes(m)}:{getSeconds(s)}
      </span>
      {showPreview ? (
        <AudioRecorderPreview
          showPreview={showPreview}
          chatAudioAnalyser={chatAudioAnalyser}
          audioBlob={chatAudioAnalyser?.state?.audioBlob}
        />
      ) : (
        <canvas id={`audio-canvas`} width={"200"} height={"30"} />
      )}

      {recorderStates?.pauseRecord ? (
        <>
          <SpeakerIcon
            width={32}
            height={32}
            handleClick={chatAudioAnalyser?.handleAudioResume}
          />
        </>
      ) : (
        <PauseIcon
          handleClick={(e) => {
            console.log("working pause");
            chatAudioAnalyser?.handleAudioPause(e);
          }}
        />
      )}
    </div>
  );
};
