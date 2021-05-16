import React from "react";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import Button from '@material-ui/core/Button';

type Props = {
  muted: boolean;
  setter: any;
};


export const MicButton: React.FC<Props> = ({ muted, setter }) => {
  let icon;
  if (muted) {
    icon = <MicOffIcon />;
  } else {
    icon = <MicIcon />;
  }
  const handleOnClick = () => {
    setter(!muted);
  };
  return <Button onClick={handleOnClick}>{icon}</Button>;
};
