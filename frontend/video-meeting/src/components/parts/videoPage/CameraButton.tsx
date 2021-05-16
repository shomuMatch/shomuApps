import React from "react";
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import Button from '@material-ui/core/Button';

type Props = {
  muted: boolean;
  setter: any;
};


export const CameraButton: React.FC<Props> = ({ muted, setter }) => {
  let icon;
  if (muted) {
    icon = <VideocamOffIcon />;
  } else {
    icon = <VideocamIcon />;
  }
  const handleOnClick = () => {
    setter(!muted);
  };
  return <Button onClick={handleOnClick}>{icon}</Button>;
};
