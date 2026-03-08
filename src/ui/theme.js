import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0",
    },
    secondary: {
      main: "#2e7d32",
    },
    background: {
      default: "#f5f7fb",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;