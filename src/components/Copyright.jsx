import {Box, Typography} from "@mui/material";


export default function Copyright() {
    return (
        <Box component="footer">
            <Typography variant="body2" align="center">
                {"Copyright © "}
                {new Date().getFullYear() + " "}
                {"Mihai Gătejescu"}
            </Typography>
        </Box>
    );
}