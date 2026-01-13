import './App.css'
import OnlineCard from "./components/OnlineCard.jsx";
import Copyright from "./components/Copyright.jsx";
import {Box, Container} from "@mui/material";

export default function App() {

  return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Container sx={{ flex: 1 }}>
              <OnlineCard />
          </Container>

          <Box component="footer" sx={{ mt: "auto" }}>
              <Copyright />
          </Box>
      </Box>
  )
}
