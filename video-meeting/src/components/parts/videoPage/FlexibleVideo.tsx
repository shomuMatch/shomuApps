import React, {useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Rnd } from 'react-rnd';


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
  }
}));


export interface FlexibleVideoProps {
  muted: boolean;
  peerId: string;
  flexibleVideosMap: Map<string,flexibleVideoType>;
  streamsMap: Map<string,MediaStream>;
  setFlexibleVideosMap: React.Dispatch<React.SetStateAction<Map<string, flexibleVideoType>>>;
  setStreamsMap: React.Dispatch<React.SetStateAction<Map<string, MediaStream>>>;
  test: any;
  requestFV: any;
}
const FlexibleVideo: React.FC<FlexibleVideoProps> = ({muted, peerId, flexibleVideosMap, requestFV, test, setFlexibleVideosMap, streamsMap, setStreamsMap}) => {
  const classes = useStyles();

  const onDrag = (e:any, d:any) => {
    const fv:flexibleVideoType = {x:d.x, y:d.y, width:flexibleVideosMap.get(peerId)?.width!, height: flexibleVideosMap.get(peerId)?.height!};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }
  const onResize = (e:any, direction:any, ref:any, delta:any, position:any) => {
    const fv:flexibleVideoType = {x:flexibleVideosMap.get(peerId)?.x!, y:flexibleVideosMap.get(peerId)?.y!, width:ref.style.width, height: ref.style.height};
    setFlexibleVideosMap(new Map<string, flexibleVideoType>(flexibleVideosMap.set(peerId, fv)));
    test();
  }

  const videoElementsRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    console.log("VIEL")
    console.log("peerID =", peerId," : ",flexibleVideosMap.get(peerId));
    console.log(streamsMap);
    videoElementsRef.current!.srcObject = streamsMap.get(peerId)!;
    videoElementsRef.current!.muted = muted;
    requestFV();
  }, [videoElementsRef]);
  useEffect(() => {
    console.log("Stream changed")
    if(videoElementsRef){
      videoElementsRef.current!.srcObject = streamsMap.get(peerId)!;
    }
  }, [streamsMap]);

  

    return (
        <Rnd
            className="rnd"
            minWidth="20"
            onDragStop={onDrag}
            onResizeStop={onResize}
            bounds="parent"
            position={{x: flexibleVideosMap.get(peerId)?.x!, y: flexibleVideosMap.get(peerId)?.y!}}
            size={{width: flexibleVideosMap.get(peerId)?.width!, height: flexibleVideosMap.get(peerId)?.height!}}
          >
            <div className={classes.parts}>
              <video
                ref={videoElementsRef}
                id="local-video"
                autoPlay
                playsInline
                width="100%"
                height="100%"
              />
            </div>
              </Rnd>
    );
};

export default FlexibleVideo;