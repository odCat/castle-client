import {Container, Typography} from "@mui/material";


export default function Copyright() {
    return (
        <Container align="bottom" maxWidth={false} disableGutter>
            <Typography variant="body2" align="center">
                {"Copyright © "}
                {new Date().getFullYear() + " "}
                {"Mihai Gătejescu"}
            </Typography>
        </Container>
    );
}