import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {styled} from "@mui/material/styles";
import {useState} from "react";
import {useNavigate} from "react-router";


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
    const navigate = useNavigate();

    async function handleSubmit(event)
    {
        event.preventDefault();

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
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        id="username"
                        placeholder="john_snow"
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        // color={nameError ? 'error' : 'primary'}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="fullname">Full name</FormLabel>
                    <TextField
                        autoComplete="name"
                        name="fullName"
                        fullWidth
                        id="fullname"
                        placeholder="John Snow"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        placeholder="your@email.com"
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        error={emailError}
                        helperText={emailErrorMessage}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                    />
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Register
                </Button>

            </Box>
        </SignCard>
    )
}
