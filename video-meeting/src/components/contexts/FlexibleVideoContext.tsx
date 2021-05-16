import * as React from 'react';

export interface flexibleVideoType{
  stream: MediaStream;
  x: number;
  y: number;
  width: number;
  height: number;

  setStream: (stream:MediaStream) => void;
  setX: (x:number) => void;
  setY: (y:number) => void;
  setWidth: (width:number) => void;
  setHeight: (height:number) => void;
}

  export const FlexibleVideoContext = React.createContext<flexibleVideoType>({
    stream: new MediaStream(),
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    setStream: (stream:MediaStream) => {},
    setX: (x:number) => {},
    setY: (y:number) => {},
    setWidth: (width:number) => {},
    setHeight: (height:number) => {},
});

export const FlexibleVideoContextProvider: React.FC = ({children}) => {
    const context: flexibleVideoType = React.useContext(FlexibleVideoContext);
  
    const [stream, setStream] = React.useState(context.stream);
    const [x, setX] = React.useState(context.x);
    const [y, setY] = React.useState(context.y);
    const [width, setWidth] = React.useState(context.width);
    const [height, setHeight] = React.useState(context.height);
  
    const newContext: flexibleVideoType = {
      stream, setStream, x, setX, y, setY, width, setWidth, height, setHeight
    };
  
    return (
      <FlexibleVideoContext.Provider value={newContext}>
        {children}
      </FlexibleVideoContext.Provider>
    );
  };