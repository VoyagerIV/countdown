import React from "react";
import { Box, Typography } from "@mui/material";

interface TimerItemProps {
  label: string;
  value: number;
}

export default function TimerItem({ label, value }: TimerItemProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "end", padding: "0 10px 0" }}>
      <Typography variant="h1">{value}</Typography>
      <Typography variant="h4" sx={{ marginRight: "15px" }}>
        {label}
      </Typography>
    </Box>
  );
}
