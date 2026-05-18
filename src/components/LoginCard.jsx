import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {useDispatch} from "react-redux";
import {login} from "../store/actions/actions.js";
import {useNavigate} from "react-router";
import {useState} from "react";


const Card = styled(MuiCard)(({ theme }) => ({
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

export default function LoginCard() {

    const [usernameOrMail, setUsernameOrMail] = useState(false);
    const [usernameOrEmailErrorMessage, setUsernameOrEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(event)
    {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const emailOrUsername = data.get("emailOrUsername");
        const password = data.get("password");

        try {
            const response = await fetch("http://localhost:8080/players/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({usernameOrEmail: emailOrUsername, password: password})
            })
            const json = await response.json();

            if (!response.ok)
            {
                if (response.status === 403) {
                    setUsernameOrMail(true);
                    setUsernameOrEmailErrorMessage("Invalid username or password");
                    setPasswordError(true);
                    setPasswordErrorMessage("Invalid username or password");
                }

                if (response.status === 400) {
                    if (json.password === "Password must not be blank") {
                        setPasswordError(true);
                        setPasswordErrorMessage("Password must not be blank");
                    }
                    if (json.usernameOrEmail === "Email or username must not be blank") {
                        setUsernameOrMail(true);
                        setUsernameOrEmailErrorMessage("Email or username must not be blank");
                    }
                }

                throw new Error();
            }

            dispatch(login(json));
            navigate("/play");
        } catch {
            // do nothing
        }
    }

    function validateInputs() {
        setUsernameOrMail(false);
        setPasswordError(false);
    }

    return (
        <Card variant="outlined">
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Login
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="emailusername">Email/Username</FormLabel>
                    <TextField
                        error={usernameOrMail}
                        helperText={usernameOrEmailErrorMessage}
                        id="emailusername"
                        type="email"
                        name="emailOrUsername"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                    />
                </FormControl>

                <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                    Login
                </Button>
            </Box>
        </Card>
    )
}