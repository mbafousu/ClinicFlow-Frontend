import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SummaryCard({ title, value, icon }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>

            <Typography variant="h4">
              {value}
            </Typography>
          </Box>

          <Box sx={{ fontSize: 40 }}>
            {icon}
          </Box>

        </Box>

      </CardContent>
    </Card>
  );
}