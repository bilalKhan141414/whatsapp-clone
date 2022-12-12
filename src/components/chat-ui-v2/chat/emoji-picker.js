import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
export const EmojiPicker = ({ setEmoji, onClickOutside, isMobileView }) => {
  return (
    <div
      className={`absolute z-50 bottom-full ${
        isMobileView ? "left-0" : "left-3"
      }`}>
      <Picker
        data={data}
        perLine={isMobileView ? 8 : 9}
        onClickOutside={onClickOutside}
        onEmojiSelect={(data) => {
          console.log(data);
          setEmoji(data.native);
        }}
      />
    </div>
  );
};
