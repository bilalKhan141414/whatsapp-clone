import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
export const EmojiPicker = ({ setEmoji, onClickOutside }) => {
  return (
    <div className='absolute z-50 bottom-full left-3'>
      <Picker
        data={data}
        onClickOutside={onClickOutside}
        onEmojiSelect={(data) => {
          console.log(data);
          setEmoji(data.native);
        }}
      />
    </div>
  );
};
