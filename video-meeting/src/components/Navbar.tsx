import React, { useState } from 'react';
import { AppBar, MenuItem, Drawer, Toolbar, IconButton } from '@material-ui/core';
import  MenuIcon  from '@material-ui/icons/Menu';

//import MenuIcon from '@material-ui/icons/Menu';


const NavBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleDrawerToggle = () => {
        setOpen(!open); // Drawer の開閉状態を反転
      };
    return(
        <div>
        <Drawer 
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
        >
          <MenuItem>React</MenuItem>
          <MenuItem>Redux</MenuItem>
          <MenuItem>React Router</MenuItem>
          <MenuItem>Material UI</MenuItem>
          <MenuItem>Electron</MenuItem>
        </Drawer>
      <AppBar>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
        </div>
    );
}

export default NavBar;