import * as React from 'react';

export interface flexibleVideoType{
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface flexibleVideos {
    values: Map<string, flexibleVideoType>;
    setValues: (values: Map<string, flexibleVideoType>) => void;
  }

  export const FlexibleVideosContext = React.createContext<flexibleVideos>({
    values: new Map<string, flexibleVideoType>(),
    setValues: (values: Map<string, flexibleVideoType>) => {},
});

export const FlexibleVideosContextProvider: React.FC = ({children}) => {
    const context: flexibleVideos = React.useContext(FlexibleVideosContext);
  
    const [values, setValues] = React.useState(context.values);
  
    const newContext: flexibleVideos = {
      values, setValues
    };
  
    return (
      <FlexibleVideosContext.Provider value={newContext}>
        {children}
      </FlexibleVideosContext.Provider>
    );
  };