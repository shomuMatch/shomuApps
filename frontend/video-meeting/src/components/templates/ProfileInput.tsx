import React,{useContext, useRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


import {UserInfoContext, userInfo} from "../contexts/UserInfoContext"

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      alignItems: "stretch",
    },
    input: {
      color: "white",
    },
    avatar: {
      marginLeft: "14px",
      marginTop: "7px",
    },
  }));



const ProfileInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
    const classes = useStyles();

    const context: userInfo = React.useContext(UserInfoContext);

    const handleClick = () => {
      inputRef.current?.click();
    };
    const getBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    const handleFileInputChange = (e:any) => {
      getBase64(e.target.files[0]).then(
        data => context.setPicture({name:e.target.files[0].name, base64:data})
      )
    }

    return (
        <div className={classes.root}>
        <TextField
        InputProps={{
            classes: {
                input: classes.input
            }
        }}
        InputLabelProps={{
          style: { color: '#fff' },
        }}
        required
        id="standard-required"
        label="Your Name"
        value={context.name}
        variant="filled"
        onChange={(e)=>{context.setName(e.target.value)}}
        />

        <div onClick={handleClick}>
          <Avatar className={classes.avatar} alt={context.name} src={context.picture.base64} />
        </div>
        <input hidden ref={inputRef} type="file" accept="image/*" onChange={handleFileInputChange}></input>
        </div>
    );
};

export default ProfileInput;