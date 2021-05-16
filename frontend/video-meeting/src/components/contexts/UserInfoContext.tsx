import * as React from 'react';

export interface userInfo {
    name: string;
    picture: any;
    setName: (name: string) => void;
    setPicture: (picture: any) => void;
  }

export const UserInfoContext = React.createContext<userInfo>({
    name: '',
    picture: {},
    setName: (name: string) => {},
    setPicture: (picture: any) => {},
});

export const UserInfoContextProvider: React.FC = ({children}) => {
    const context: userInfo = React.useContext(UserInfoContext);
  
    const [name, setName] = React.useState(context.name);
    const [picture, setPicture] = React.useState(context.picture);
  
    const newContext: userInfo = {
        name, setName, picture, setPicture
    };
  
    return (
      <UserInfoContext.Provider value={newContext}>
        {children}
      </UserInfoContext.Provider>
    );
  };