export class UserProfileModel {
  constructor(rawData) {
    this.id = rawData.userId;
    this.displayName = rawData.displayName;
    this.username = rawData.username;
    this.userBio = rawData.userBio;
    this.followersCount = rawData.followersCount;
    this.followingCount = rawData.followingCount;
    this.postsCount = rawData.postsCount;
    this.isFollowing = rawData.isFollowing;
    this.bgImageSource = rawData.bgImage || null;
    this.userIcon = {
      bgColor: rawData.userIcon?.bgColor || "transparent",
      customIcon: rawData.userIcon?.customIcon || null,
      id: rawData.userIcon?.id || null,
    };
    this.song = {
      borderColor: rawData.song?.borderColor || "#7546b3",
      imageUri: rawData.song?.imageUri || null,
      songUri: rawData.song?.songUri || null,
      songName: rawData.song?.songName || null,
    };
  }
}