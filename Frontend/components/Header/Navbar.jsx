import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useAuth } from "./AuthContext";
import axios from "axios";

const pages = [
  { name: "Home", path: "/" },
  { name: "Teachers", path: "/teachers" },
  { name: "Become a Tutor", path: "/beteacher" },
];
const settings = ["Profile", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { isLoggedIn, setIsLoggedIn, loading, user } = useAuth();
  const navigate = useNavigate();

  // Handling navigation menu open/close
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle login/logout functionality
  const handleLoginLogout = async () => {
    try {
      if (isLoggedIn) {
        await axios.post(
          "http://localhost:3000/logout",
          {},
          { withCredentials: true }
        );
        setIsLoggedIn(false);
        navigate("/");
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error handling login/logout:", error);
    }
  };

  // Handle profile and logout actions
  const handleSettingClick = (setting) => {
    if (setting === "Logout") {
      handleLoginLogout();
    } else if (setting === "Profile") {
      navigate("/profile");
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        color: "black",
        paddingY: 0.6,
        top: 0,
        overflowX: "hidden", 
      }}
    >
      <Container maxWidth="xl" sx={{ overflowX: "hidden" }}>
        <Toolbar disableGutters sx={{ alignItems: "center", height: "100%" }}>
          {/* Mobile Logo */}
          <Box
            component="img"
            src="/nav.png"
            alt="Logo"
            sx={{
              height: "60px",
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          {/* Mobile Menu Icon and User Avatar */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              ml: "auto",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <MenuIcon />
            </IconButton>
            {/* Display avatar if logged in */}
            {!loading && isLoggedIn && (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, m: 0 }}>
                  <Avatar
                    alt="User"
                    src={""}
                    sx={{
                      bgcolor: "#032b63", 
                      color: "#fff", 
                    }}
                  >
            
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : null}
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}

            {/* Mobile menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    sx={{ fontFamily: "Arial, sans-serif" }}
                    component={NavLink}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleLoginLogout}>
                <Typography
                  textAlign="center"
                  sx={{ fontFamily: "Arial, sans-serif" }}
                >
                  {!loading && isLoggedIn ? "Logout" : "Sign Up"}
                </Typography>
              </MenuItem>
            </Menu>

            {/* User menu when logged in */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleSettingClick(setting)}
                >
                  <Typography
                    textAlign="center"
                    sx={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Logo */}
          <Box
            component="img"
            src="/nav.png"
            alt="Logo"
            sx={{
              height: "60px",
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          {/* Desktop Navigation Links */}
          <Box
            component="ul"
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              alignItems: "center",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {pages.map((page) => (
              <Box
                component="li"
                key={page.name}
                sx={{
                  my: 2,
                  mx: 2,
                  color: "black",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#2596be",
                  },
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <NavLink
                  to={page.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {page.name}
                </NavLink>
              </Box>
            ))}
          </Box>

          {/* Desktop User Actions */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {loading ? (
              <Typography></Typography>
            ) : isLoggedIn ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, m: 0 }}>
                  <Avatar
                    alt="User"
                    src={""}
                    sx={{
                      bgcolor: "#032b63",
                      color: "#fff",
                    }}
                  >
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : null}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                sx={{ m: 0, backgroundColor: "#346df0", color: "white" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
