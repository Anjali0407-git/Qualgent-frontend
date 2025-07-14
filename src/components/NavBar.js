// // import React from 'react';
// // import AppBar from '@mui/material/AppBar';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';

// // const NavBar = () => (
// //   <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
// //     <Toolbar>
// //       <Typography variant="h6" noWrap>
// //         Qualgent Platform
// //       </Typography>
// //     </Toolbar>
// //   </AppBar>
// // );

// // export default NavBar;

// import React, { useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// const NavBar = () => {
//   const token = localStorage.getItem('token');
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     handleMenuClose();
//     window.location.reload(); // or redirect to login page
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
//           Qualgent Platform
//         </Typography>

//         {!token ? (
//           <>
//             <Button color="inherit" href="/login">
//               Login
//             </Button>
//             <Button color="inherit" href="/signup">
//               Signup
//             </Button>
//           </>
//         ) : (
//           <>
//             <IconButton
//               size="large"
//               edge="end"
//               color="inherit"
//               onClick={handleProfileMenuOpen}
//               aria-controls="profile-menu"
//               aria-haspopup="true"
//             >
//               <AccountCircle />
//             </IconButton>
//             <Menu
//               id="profile-menu"
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//             >
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;

// import React, { useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Tooltip from '@mui/material/Tooltip';

// const NavBar = () => {
//   const token = localStorage.getItem('token');
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     handleMenuClose();
//     window.location.reload();
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
//           Qualgent Platform
//         </Typography>

//         {!token ? (
//           <>
//             <Button color="inherit" href="/login">
//               Login
//             </Button>
//             <Button color="inherit" href="/signup">
//               Signup
//             </Button>
//           </>
//         ) : (
//           <>
//               <IconButton
//                 size="large"
//                 edge="end"
//                 color="inherit"
//                 onClick={handleProfileMenuOpen}
//                 aria-controls="profile-menu"
//                 aria-haspopup="true"
//                 sx={{ mr: 2 /* add margin-right to shift icon left */ }}
//               >
//                 <AccountCircle />
//               </IconButton>
//             <Menu
//               id="profile-menu"
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'center',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'center',
//               }}
//             >
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default NavBar;


import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const NavBar = () => {
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!token) return;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(res.data.username);
    } catch {
      setUsername('');
    }
  };

  fetchProfile();
  }, [token]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    handleMenuClose();
    window.location.reload();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Qualgent Platform
        </Typography>

        {!token ? (
          <>
            <Button color="inherit" href="/login">
              Login
            </Button>
            <Button color="inherit" href="/signup">
              Signup
            </Button>
          </>
        ) : (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
              sx={{ mr: 3 }}
              title={username || 'User'}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                {username || 'User'}
              </Typography>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
