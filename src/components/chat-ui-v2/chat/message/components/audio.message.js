export const MessageAudio = ({}) => {
  return (
    <div>
      <audio controls>
        <source src='horse.mp3' type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
