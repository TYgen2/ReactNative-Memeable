import { memo } from "react";
import FastImage from "react-native-fast-image";
import { getSongImageSource } from "../../utils/helper";

export default UserSongCover = memo(({ songImg, imgStyle }) => {
  return (
    <FastImage
      source={getSongImageSource(songImg)}
      style={{
        width: imgStyle.width - 10,
        height: imgStyle.height - 10,
        marginRight: imgStyle.marginRight + 5,
        marginTop: imgStyle.marginTop + 5,
        position: imgStyle.position,
        top: imgStyle.top,
        right: imgStyle.right,
        borderRadius: 5,
      }}
      resizeMode="cover"
    />
  );
});
