import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const SignCard = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function RegisterCard() {

    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    function validateForm() {
        const username = document.querySelector("#username").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        console.log(username);
        console.log(email);
        console.log(password);

        let isValid = true;

        if (!username.trim()) {
            setUsernameError(true);
            setUsernameErrorMessage("Username should not be empty");
            isValid = false;
        }
        if (!email.trim()) {
            setEmailError(true);
            setEmailErrorMessage("Email should not be empty");
            isValid = false;
        }
        if (!password.trim()) {
            setPasswordError(true);
            setPasswordErrorMessage("Password should not be empty");
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(event)
    {
        event.preventDefault();
        if (!validateForm()) return;

        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const username = data.get("username");
        const password = data.get("password");
        const fullName = data.get("fullName");

        try {
            const response = await fetch("http://localhost:8080/players/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                    fullName: fullName
                })
            })
            const json = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    if (json.username) {
                        setUsernameError(true);
                        setUsernameErrorMessage(json.username);
                    }
                    if (json.email) {
                        setEmailError(true);
                        setEmailErrorMessage(json.email);
                    }
                    if (json.password) {
                            setPasswordError(true);
                            setPasswordErrorMessage(json.password);
                    }
                }

                if (response.status === 403) {
                    if (json.error === "UNIQUE constraint failed: players.username") {
                        setUsernameError(true);
                        setUsernameErrorMessage("Username is already taken");
                    }
                    if (json.error === "UNIQUE constraint failed: players.email") {
                        setEmailError(true);
                        setEmailErrorMessage("Email is already taken");
                    }
                }

                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }

            navigate("/login");
        } catch {
            // do nothing
        }
    }

    function validateInputs() {
        setUsernameError(false);
        setUsernameErrorMessage("");
        setEmailError(false);
        setEmailErrorMessage("");
        setPasswordError(false);
        setPasswordErrorMessage("");
    }

    return (
        <SignCard>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign up
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >

                <FormControl>
                    <FormLabel htmlFor="username">User name</FormLabel>
                    <TextField
                        id="username"
                        name="username"
                        placeholder="john_snow"
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        autoComplete="username"
                        fullWidth
                        // color={nameError ? 'error' : 'primary'}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="fullname">Full name</FormLabel>
                    <TextField
                        id="fullname"
                        name="fullName"
                        placeholder="John Snow"
                        autoComplete="name"
                        fullWidth
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        error={emailError}
                        helperText={emailErrorMessage}
                        autoComplete="email"
                        variant="outlined"
                        fullWidth
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        type={ showPassword ? "text" : "password" }
                        placeholder="••••••"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        autoComplete="new-password"
                        variant="outlined"
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                </FormControl>

                <Button
                    type="submit"
                    onClick={validateInputs}
                    variant="contained"
                    fullWidth
                >
                    Register
                </Button>

            </Box>
        </SignCard>
    )
}
