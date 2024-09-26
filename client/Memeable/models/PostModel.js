import { getIconSource, getSquareImageHeight } from "../utils/helper";

export class PostModel {
  constructor(rawPostData) {
    this.id = rawPostData._id;
    this.userId = rawPostData.userId._id;
    this.userDisplayName = rawPostData.userId.displayName;
    this.userIcon = getIconSource(rawPostData.userId.icon);
    this.userIconBgColor = rawPostData.userId.icon.bgColor || "transparent";
    this.title = rawPostData.title;
    this.description = rawPostData.description;
    this.hashtag = rawPostData.hashtag;
    this.imageUri = rawPostData.imageUri;
    this.imageHeight = this.calculateImageHeight(
      rawPostData.height,
      rawPostData.width
    );
    this.likes = rawPostData.likes;
    this.hasLiked = rawPostData.hasLiked;
    this.timeAgo = rawPostData.timeAgo;
  }

  calculateImageHeight(height, width) {
    const squareHeight = getSquareImageHeight();
    if (height > width) return 500;
    if (height < width) return 200;
    return squareHeight;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      userDisplayName: this.userDisplayName,
      userIcon: this.userIcon,
      userIconBgColor: this.userIconBgColor,
      title: this.title,
      description: this.description,
      hashtag: this.hashtag,
      imageUri: this.imageUri,
      imageHeight: this.imageHeight,
      likes: this.likes,
      hasLiked: this.hasLiked,
      timeAgo: this.timeAgo,
    };
  }
}
