import React, {useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Rnd } from 'react-rnd';
import IconButton from '@material-ui/core/IconButton';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';


import {flexibleVideoType} from '../../interfaces/flexibleVideoType'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
  },
  parts: {
    background: "black",
    width: "100%",
    height: "100%"
  },
  videoOwn: {
    transform: "scale(-1,1)"
  },
  videoOther: {
    transform: "scale(1,1)"
  },
  fitButton: {
    position: "absolute",
    top: "5px",
    right: "5px"
  },
  hidden: {
    display: "none"
  },
}));


export interface FlexibleVideoProps {
  muted: boolean;
  peerId: string;
  myPeerId: string;
  flexibleVideosMap: Map<string,flexibleVideoType>;
  streamsMap: Map<string,MediaStream>;
  setFlexibleVideosMap: React.Dispatch<React.SetStateAction<Map<string, flexibleVideoType>>>;
  setStreamsMap: React.Dispatch<React.SetStateAction<Map<string, MediaStream>>>;
  test: any;
  requestFV: any;
}
const FlexibleVideo: React.FC<FlexibleVideoProps> = ({muted, myPeerId, peerId, flexibleVideosMap, requestFV, test, setFlexibleVideosMap, streamsMap, setStreamsMap}) => {
  const classes = useStyles();

  const onDrag = (e:any, d:any) => {
    const fv:flexibleVideoType = {x:d.x, y:d.y, width:flexibleVideosMap.get(peerId)?.width!, height: flexibleVideosMap.get(peerId)?.height!, zIndex: flexibleVideosMap.get(peerId)?.zIndex!};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }
  const onResize = (e:any, direction:any, ref:any, delta:any, position:any) => {
    const fv:flexibleVideoType = {x:position.x, y:position.y, width:parseInt(ref.style.width), height: parseInt(ref.style.height), zIndex: flexibleVideosMap.get(peerId)?.zIndex!};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }
  const onMouseDown = () => {
    var maxZIndex = 0;
    flexibleVideosMap.forEach((val,key) => {maxZIndex = Math.max(maxZIndex, val.zIndex)});
    const fv:flexibleVideoType = {x:flexibleVideosMap.get(peerId)?.x!, y:flexibleVideosMap.get(peerId)?.y!, width:flexibleVideosMap.get(peerId)?.width!, height: flexibleVideosMap.get(peerId)?.height!, zIndex: maxZIndex + 1};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }

  const videoElementsRef = useRef<HTMLVideoElement>(null);
  const rndRef = useRef<Rnd>(null);

  useEffect(() => {
    videoElementsRef.current!.srcObject = streamsMap.get(peerId)!;
    videoElementsRef.current!.muted = muted;
    requestFV();
  }, [videoElementsRef]);
  useEffect(() => {
    if(videoElementsRef){
      videoElementsRef.current!.srcObject = streamsMap.get(peerId)!;
    }
  }, [streamsMap]);

  const rndFit = () => {
    var width = flexibleVideosMap.get(peerId)?.width!;
    var height = flexibleVideosMap.get(peerId)?.height!;
    var x = flexibleVideosMap.get(peerId)?.x!;
    var y = flexibleVideosMap.get(peerId)?.y!;
    streamsMap.get(peerId)?.getTracks().map((t) => {
      if(t.kind == "video" && t.readyState == "live"){
        const aspectRatio = t.getSettings().aspectRatio!;
        const aspectRatioCurrent = width / height;
        if(aspectRatioCurrent < aspectRatio){
          const height2 = width / aspectRatio;
          y += (height - height2) / 2
          height = height2
        } else {
          const width2 = height * aspectRatio;
          x += (width - width2) / 2
          width = width2
        }
      }
    })
    const fv:flexibleVideoType = {x:x, y:y, width:width, height: height, zIndex: flexibleVideosMap.get(peerId)?.zIndex!};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }
  
  const [fitButtonShow, setFitButtonShow] = React.useState(false);

    return (
        <Rnd
            ref = {rndRef}
            className="rnd"
            minWidth="20"
            onDragStop={onDrag}
            onResizeStop={onResize}
            onMouseDown={onMouseDown}
            onMouseEnter={() => {setFitButtonShow(true)}}
            onMouseLeave={() => {setFitButtonShow(false)}}
            bounds="parent"
            position={{x: flexibleVideosMap.get(peerId)?.x!, y: flexibleVideosMap.get(peerId)?.y!}}
            size={{width: flexibleVideosMap.get(peerId)?.width!, height: flexibleVideosMap.get(peerId)?.height!}}
            style={{zIndex: flexibleVideosMap.get(peerId)?.zIndex!}}
          >
            <div className={classes.parts}>
              <video
                ref={videoElementsRef}
                id="local-video"
                autoPlay
                playsInline
                width="100%"
                height="100%"
                className={myPeerId==peerId ? classes.videoOwn : classes.videoOther}
              />
              <IconButton aria-label="fit" onClick={rndFit} className={fitButtonShow ? classes.fitButton : classes.hidden} color="primary">
                <AspectRatioIcon />
              </IconButton>
            </div>
              </Rnd>
    );
};

export default FlexibleVideo;