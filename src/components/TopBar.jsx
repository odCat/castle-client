import {AppBar, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import Box from "@mui/material/Box";
import {logout} from "../store/actions/actions.js";


const TopBarButton = styled(Button)({
    "&:hover": { backgroundColor: "#15273b" },
    color: 'white',
    display: 'block'
})

export default function TopBar() {

    const navigate = useNavigate();
    const username = useSelector(store => store.player.username);
    const id = useSelector(store => store.player.id);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);

    };

    function goToProfile() {
        navigate(`/profile/${id}`)
    }

    function goToSettings() {
        navigate("/settings");
    }

    function logoutOnClick() {
        dispatch(logout());
        navigate("/login");
    }

    return (
        <AppBar position="static" sx={{ bgcolor: '#0c1a29', minWidth: "700px" }}>
            <Toolbar>
                <TopBarButton onClick={() => navigate("/play")}>Play</TopBarButton>
                <TopBarButton onClick={() => navigate("/watch")}>Watch</TopBarButton>
                <TopBarButton onClick={() => navigate("/tools/demo")}>Demo</TopBarButton>
                { username &&
                    <Box sx={{ ml: "auto", bg: "#0c1a29" }}>
                        <TopBarButton onClick={handleOpen}>{username}</TopBarButton>
                        { username !== "Guest" &&
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                sx={{ py: 0, mt: 1, "& .MuiPaper-root": { bgcolor: "#0c1a29" } }}
                            >
                                <MenuItem onClick={goToProfile}
                                          sx={{
                                              backgroundColor: "#0c1a29",
                                              "&:hover": { backgroundColor: "#15273b" },
                                              color: "white"
                                          }}
                                >Profile</MenuItem>

                                <MenuItem onClick={goToSettings}
                                          sx={{
                                              backgroundColor: "#0c1a29",
                                              "&:hover": { backgroundColor: "#15273b" },
                                              color: "white"
                                          }}
                                >Settings</MenuItem>

                                <MenuItem onClick={logoutOnClick}
                                    sx={{
                                        backgroundColor: "#0c1a29",
                                        "&:hover": { backgroundColor: "#15273b" },
                                        color: "white"
                                    }}
                                >Logout</MenuItem>
                            </Menu>
                        }
                    </Box>
                }
            </Toolbar>
        </AppBar>
    )
}