export class UserDto {
  id = "";
  userName = "";
  friends = [];
  friendsIds = [];

  constructor(user) {
    this.id = user?._id;
    this.userName = user?.userName;
    this.friends = user?.friends;
    this.friendsIds = user?.friendsIds;
    this.chatIds = user?.chatIds;
  }
}
