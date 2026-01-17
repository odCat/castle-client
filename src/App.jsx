import './App.css'
import LoginCard from "./components/LoginCard.jsx";
// import OnlineCard from "./components/OnlineCard.jsx";
import Copyright from "./components/Copyright.jsx";
import {Box, Container} from "@mui/material";
// import RegisterCard from "./components/RegisterCard.jsx";


export default function App() {

  return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
              <LoginCard />
              {/*<RegisterCard />*/}
              {/*<OnlineCard /> */}
          </Container>

          <Copyright />
      </Box>
  )
}
