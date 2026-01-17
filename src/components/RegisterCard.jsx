import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import {styled} from "@mui/material/styles";


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
                // onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="name">User name</FormLabel>
                    <TextField
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        id="name"
                        placeholder="john_snow"
                        // error={nameError}
                        // helperText={nameErrorMessage}
                        // color={nameError ? 'error' : 'primary'}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="name">Full name</FormLabel>
                    <TextField
                        autoComplete="name"
                        name="name"
                        fullWidth
                        id="name"
                        placeholder="Jon Snow"
                        // error={nameError}
                        // helperText={nameErrorMessage}
                        // color={nameError ? 'error' : 'primary'}
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
                        // error={emailError}
                        // helperText={emailErrorMessage}
                        // color={passwordError ? 'error' : 'primary'}
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
                        // error={passwordError}
                        // helperText={passwordErrorMessage}
                        // color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    // onClick={validateInputs}
                >
                    Sign up
                </Button>

            </Box>
        </SignCard>
    )
}
