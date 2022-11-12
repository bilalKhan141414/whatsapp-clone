import userImg from "./../../../assets/images/user.png";

export const UserSingleIcon = ({ src, dimensions, className }) => {
  return (
    <img
      className={`${dimensions ?? "h-10 w-10"} ${className ?? "rounded-full"} ${
        src ? "" : `bg-user-gray px-1 pt-2 pb-0 object-cover`
      }`}
      src={src ?? userImg}
      alt={src ?? "User Img"}
    />
  );
};
