import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';


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

    async function handleSubmit() {
        console.log("Submitting...")
        console.log(JSON.stringify({email: "gigel", password: "gigel"}));

        try {
            const response = await fetch("http://localhost:8080/players/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({usernameOrEmail: "gigel", password: "gigel"})
            })
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Card variant="outlined">
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        // error={emailError}
                        // helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        // color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        // error={passwordError}
                        // helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        // color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>

                <Button type="submit" fullWidth variant="contained" /*onClick={validateInputs}*/>
                    Login
                </Button>
            </Box>
        </Card>
    )
}