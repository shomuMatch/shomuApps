import React, {useCallback, useEffect} from 'react';
import GeneralTemplate from '../templates/GeneralTemplate';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import {CameraButton} from '../parts/videoPage/CameraButton';
import {MicButton} from '../parts/videoPage/MicButton';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import { useLocation, useHistory } from 'react-router-dom';
import FlexibleVideo from '../parts/videoPage/FlexibleVideo'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {flexibleVideoType} from '../interfaces/flexibleVideoType'

import Peer, { MeshRoom} from "skyway-js";

const queryString = require('query-string');
const APIKey = process.env.REACT_APP_SKYWAY_API_KEY as string;
const peer = new Peer({key: APIKey});
const peerSS = new Peer({key: APIKey});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  begin: {
    display: "flex",
    verticalAlign: "middle",
  },
  options: {
    display: "flex",
    verticalAlign: "middle",
  },
  videos: {
    width: "100%",
    height: "100%",
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  toHide: {
    height: 0,
		padding: 0,
    overflow: "hidden",
	}
}));

//整列機能
//前後の順番調節機能（クリックしたら最前面で良さげ）

function makeRoomName() {
  return Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2);
}


const VideoPage: React.FC = () => {

  
  const setMapState = <T1,T2>(originalMap:Map<T1,T2>,setter:React.Dispatch<React.SetStateAction<Map<T1, T2>>>,key:T1, value:T2) =>{
    setter(new Map<T1,T2>(originalMap.set(key, value)));
  }


  const classes = useStyles();
  const [roomName, setRoomName] = React.useState(makeRoomName());
  const [videoDeviceId, setVideoDeviceId] = React.useState(0);
  const [audioInputDeviceId, setAudioInputDeviceId] = React.useState(0);
  const [videoDevicesMap, setVideoDevicesMap] = React.useState(new Map<number,{deviceId:string, deviceName:string}>());
  const [audioInputDevicesMap, setAudioInputDevicesMap] = React.useState(new Map<number,{deviceId:string, deviceName:string}>());
  const [audioOutputDevicesMap, setAudioOutputDevicesMap] = React.useState(new Map<number,{deviceId:string, deviceName:string}>());

  const [room,setRoom] = React.useState<MeshRoom>();
  const [roomSS,setRoomSS] = React.useState<MeshRoom>();
  const [sharing, setSharing] = React.useState(false);
  const [connected,setConnected] = React.useState(false);
  
  const [flexibleVideosMap, setFlexibleVideosMap] = React.useState(new Map<string,flexibleVideoType>());
  const [streamsMap, setStreamsMap] = React.useState<Map<string,MediaStream>>(new Map<string,MediaStream>());

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const location = useLocation();
  const history = useHistory();
  
  const [mutedState, setMutedState] = React.useState(false);
  const micSetter = (isChecked: boolean) => setMutedState(isChecked);
  const [cameraState, setCameraState] = React.useState(false);
  const cameraSetter = (isChecked: boolean) => setCameraState(isChecked);
  const [syncPosition, setSyncPosition] = React.useState(false);

  const setDeviceConf = useCallback(
    () => {
      streamsMap.get(peer.id)?.getTracks().forEach((t) => {
        if(t.kind === "video"){
          t.enabled = !cameraState;
        }
        if(t.kind === "audio"){
          t.enabled = !mutedState;
        }
      })
      return;
    },
    [cameraState, mutedState]
  );
  
//カメラのon/offボタンの実装
useEffect(() => {
  setDeviceConf();
}, [cameraState, setDeviceConf]);

//マイクのon/offボタンの実装
useEffect(() => {
  setDeviceConf();
}, [mutedState, setDeviceConf]);



  

  const setFlexibleVideos = (peerId: string, stream: MediaStream) => {
    const fv:flexibleVideoType = {x:0, y:0, width:320, height: 180, zIndex: 0};
    setMapState<string,flexibleVideoType>(flexibleVideosMap, setFlexibleVideosMap, peerId, fv);
    setMapState<string,MediaStream>(streamsMap, setStreamsMap, peerId, stream);
  }
  
  useEffect(() => {
    const qp = queryString.parse(location.search);
    if(qp.roomName){
      setRoomName(qp.roomName);
    }
    navigator.mediaDevices.enumerateDevices().then(gotDevices);
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        aspectRatio: 1.777777,
        width: {min: 640, max: 1920},
        height: {min: 360, max: 1080},
        facingMode: 'environment'
      }
    }).then((stream) => {
      setFlexibleVideos(peer.id,stream);
      room?.replaceStream(stream);
    });
  },[]);

  useEffect(() => {
    if(room){
      room.on('stream', (stream:any) => {
        setFlexibleVideos(stream.peerId,stream);
        // setStreamsMap(new Map<string, MediaStream>(streamsMap.set(stream.peerId, stream)));
      });
  
      room.on('peerJoin', (peerId:string) => {
        
        
      });
      room.on('data', (arg) => {
        const src = arg.src;
        const data = arg.data;
        const targetPeerId = src;
        const targetData = data;
        if(targetData.type){
          if(targetData.type == "flexibleVideo"){
            if(syncPosition){
              const tmpMap = new Map<string, flexibleVideoType>();
              targetData.flexibleVideosMap.forEach((e:any) => tmpMap.set(e[0],e[1]));
              setFlexibleVideosMap(tmpMap);
            }
          } else if(targetData.type == "requestFV"){
            room?.send({type:"flexibleVideo", flexibleVideosMap: Array.from(flexibleVideosMap.entries())});
          }
        }
      });

      room.on("peerLeave", (peerId) => {
        const tmpFVMap = new Map<string,flexibleVideoType>(flexibleVideosMap);
        const tmpStreamMap = new Map<string,MediaStream>(streamsMap);
        tmpFVMap.delete(peerId);
        tmpStreamMap.delete(peerId);
        setFlexibleVideosMap(tmpFVMap);
        setStreamsMap(tmpStreamMap);
      });
    }
  }, [room]);
  
  const switchSync = () => {
    room?.removeAllListeners('data');
    room?.on('data', (arg) => {
      const src = arg.src;
      const data = arg.data;
      const targetPeerId = src;
      const targetData = data;
      if(targetData.type){
        if(targetData.type == "flexibleVideo"){
          if(!syncPosition){
            const tmpMap = new Map<string, flexibleVideoType>();
            targetData.flexibleVideosMap.forEach((e:any) => tmpMap.set(e[0],e[1]));
            setFlexibleVideosMap(tmpMap);
          }
        } else if(targetData.type == "requestFV"){
          if(!syncPosition){
            room?.send({type:"flexibleVideo", flexibleVideosMap: Array.from(flexibleVideosMap.entries())});
          }
        }
      }
    });
    setSyncPosition(!syncPosition);
  }

  const startMeeting = () => {
    if(!peer){
      return;
    }
    const roomtmp = peer.joinRoom<MeshRoom>(roomName, {
      mode: "mesh",
      stream: streamsMap.get(peer.id),
    });
    setRoom(roomtmp);
    setConnected(true);
    history.replace(location.pathname+"?roomName="+roomName);
  }


  
  const test = () => {
    if(syncPosition){
      room?.send({type:"flexibleVideo", flexibleVideosMap: Array.from(flexibleVideosMap.entries())});
    }
  }

  const requestFV = () => {
    room?.send({type:"requestFV"});
  }

  

  const gotDevices = (deviceInfos:any) => {
    let audioInputCount = 0;
    let audioOutputCount = 0;
    let videoCount = 0;
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const deviceId = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        const deviceName = deviceInfo.label || ("microphone " + deviceInfo.deviceId);
        setMapState<number,{deviceId:string, deviceName:string}>(audioInputDevicesMap, setAudioInputDevicesMap, audioInputCount, {deviceId,deviceName});
        audioInputCount++;
      } else if (deviceInfo.kind === 'audiooutput') {
        const deviceName = deviceInfo.label || ("speaker " + deviceInfo.deviceId);
        setMapState<number,{deviceId:string, deviceName:string}>(audioOutputDevicesMap, setAudioOutputDevicesMap, audioOutputCount, {deviceId,deviceName});
        audioOutputCount++;
      } else if (deviceInfo.kind === 'videoinput') {
        const deviceName = deviceInfo.label || ("camera " + deviceInfo.deviceId);
        setMapState<number,{deviceId:string, deviceName:string}>(videoDevicesMap, setVideoDevicesMap, videoCount, {deviceId,deviceName});
        videoCount++;
      } else {
      }
    }
  }

  const setDevice = (id: number, isVideo: boolean) => {
    var constraints = {};
    if(isVideo){
      constraints = {
        audio: {deviceId: audioInputDevicesMap.get(audioInputDeviceId)?.deviceId ? {exact: audioInputDevicesMap.get(audioInputDeviceId)?.deviceId} : undefined},
        video: {
          deviceId: videoDevicesMap.get(id)?.deviceId ? {exact: videoDevicesMap.get(id)?.deviceId} : undefined,
          aspectRatio: 1.777777,
          width: {min: 640, max: 1920},
          height: {min: 360, max: 1080},
          facingMode: 'environment'
        }
      };
    }else{
      constraints = {
        audio: {deviceId: audioInputDevicesMap.get(id)?.deviceId ? {exact: audioInputDevicesMap.get(id)?.deviceId} : undefined},
        video: {
          deviceId: videoDevicesMap.get(videoDeviceId)?.deviceId ? {exact: videoDevicesMap.get(videoDeviceId)?.deviceId} : undefined,
          aspectRatio: 1.777777,
          width: {min: 640, max: 1280},
          height: {min: 360, max: 720},
          facingMode: 'environment'
        }
      };
    }
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      stream.getTracks().map((t) => {
        if(t.kind == "video"){
          t.enabled = !cameraState;
        }
        if(t.kind == "audio"){
          t.enabled = !mutedState;
        }
      })
      setFlexibleVideos(peer.id,stream);
      room?.replaceStream(stream);
    });
    return;
  }

  const finishMeeting = () => {
    if(sharing){
      roomSS?.close();
      setSharing(false);
      streamsMap.get(peerSS.id)?.getTracks().map((t) => {
        t.stop();
      });
    }
    room?.close();
    streamsMap.get(peer.id)?.getTracks().map((t) => {
      t.stop();
    });
    const tmpFVMap = new Map<string,flexibleVideoType>();
    const tmpStreamMap = new Map<string,MediaStream>();
    setFlexibleVideosMap(tmpFVMap);
    setStreamsMap(tmpStreamMap);
    setConnected(false);
  }

  const screenShare = () => {
    if(!connected){
      return;
    }
    if(sharing){
      roomSS?.close();
      setSharing(false);
      streamsMap.get(peerSS.id)?.getTracks().map((t) => {
        t.stop();
      });
    }else {
      const mediaDevices = navigator.mediaDevices as any;
      mediaDevices.getDisplayMedia({ video: true }).then((stream:any) => {
        const roomtmp = peerSS.joinRoom<MeshRoom>(roomName, {
          mode: "mesh",
          stream: stream,
        });
        setFlexibleVideos(peerSS.id,stream);
        setRoomSS(roomtmp);
      });
      setSharing(true);
    }
  }

    return (
      <GeneralTemplate title="ビデオ通話ページ">
      <div className={classes.root}>
        <div className={!connected ? classes.begin: classes.toHide}>
          <TextField
        required
        id="standard-required-2"
        label="Room Name"
        value={roomName}
        variant="filled"
        onChange={(e)=>{setRoomName(e.target.value)}}
        />
        <Button variant="outlined" onClick={startMeeting}>開始</Button>
        </div>
        <div className={classes.options}>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>動画・音声の入力デバイスの選択</Button>
          <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
            <DialogTitle>動画・音声の入力デバイスを選択してください</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="videoSelectorLabel">動画入力デバイス</InputLabel>
          <Select
            labelId="videoSelect"
            id="videoSelect"
            value={videoDeviceId}
            onChange={(e) =>{setVideoDeviceId(e.target.value as number);setDevice(e.target.value as number, true);}}
          >
            {[...Array.from(videoDevicesMap.keys())].map(id =>{
              return <MenuItem key={"video" + videoDevicesMap.get(id)?.deviceName} value={id}>{id}{videoDevicesMap.get(id)?.deviceName}</MenuItem>
            })}
          </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="audioInputSelectorLabel">音声入力デバイス</InputLabel>
          <Select
            labelId="audioInputSelect"
            id="audioInputSelect"
            value={audioInputDeviceId}
            onChange={(e) =>{setAudioInputDeviceId(e.target.value as number);setDevice(e.target.value as number, false);}}
          >
            {[...Array.from(audioInputDevicesMap.keys())].map(id =>{
              return <MenuItem key={"audioInput" + audioInputDevicesMap.get(id)?.deviceName} value={id}>{id}{audioInputDevicesMap.get(id)?.deviceName}</MenuItem>
            })}
          </Select>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Button variant="outlined" color="secondary" onClick={finishMeeting}><CallEndIcon /></Button>
      <CameraButton muted={cameraState} setter={cameraSetter} />
      <MicButton muted={mutedState} setter={micSetter} />
      <Button onClick={screenShare}>{sharing ? <StopScreenShareIcon />: <ScreenShareIcon />}</Button>
      <FormControlLabel
        control={
          <Switch
            checked={syncPosition}
            onChange={switchSync}
            name="setSyncPos"
            color="primary"
          />
        }
        label="位置を同期する"
      />
        </div>
        <div className={classes.videos}>
            {[...Array.from(streamsMap.keys())].map(peerID =>{
              return <FlexibleVideo key={peerID} muted={peerID==peer.id} peerId={peerID} myPeerId={peer.id} flexibleVideosMap={flexibleVideosMap} setFlexibleVideosMap={setFlexibleVideosMap} streamsMap={streamsMap} setStreamsMap={setStreamsMap} requestFV={requestFV} test={test} />
            })}
        </div>
      </div>
      </GeneralTemplate>
    );
};

export default VideoPage;