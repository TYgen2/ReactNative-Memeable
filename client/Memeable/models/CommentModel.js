export class CommentModel {
  constructor(data) {
    this._id = data._id;
    this.userId = data.userId;
    this.content = data.content;
    this.likes = data.likes;
    this.hasLiked = data.hasLiked;
    this.timeAgo = data.timeAgo;
    this.user = {
      displayName: data.user.displayName,
      icon: data.user.icon,
    };
    this.parentCommentId = data.parentCommentId;
    this.hasSubComment = data.hasSubComment;
    this.subComments = data.subComments || [];
  }

  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      content: this.content,
      likes: this.likes,
      hasLiked: this.hasLiked,
      timeAgo: this.timeAgo,
      user: this.user,
      parentCommentId: this.parentCommentId,
      hasSubComment: this.hasSubComment,
      subComments: this.subComments,
    };
  }
}
