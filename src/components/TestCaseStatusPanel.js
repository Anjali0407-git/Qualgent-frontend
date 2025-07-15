import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, ButtonGroup } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

const mobileImageUrl = "iphone.jpg";

export default function TestCaseStatusPanel(props) {
  const [command, setCommand] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [logView, setLogView] = useState("live");
  const token = localStorage.getItem("token");
  const API   = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/queues`, { taskId: props.testCase._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Queue data:", res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setLoading(false);
    }
  };

  const liveLogs =
  `[INFO] Connecting to device...
  [INFO] Running command: ${command || "N/A"}
  [INFO] Test started...
  [DEBUG] Step 1: Initialize sensors
  [DEBUG] Step 2: Check battery status
  [INFO] Test completed successfully.`;

  const historyLogs =
  `[2025-07-15 09:12:23] Test run #123 completed.
  [2025-07-14 16:45:01] Test run #122 failed.
  [2025-07-13 14:30:45] Test run #121 completed.
  [2025-07-12 11:22:33] Test run #120 completed with warnings.`;


  return (
    <Paper
      sx={{
        p: 2,
        ml: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        size="small"
        sx={{ position: "absolute", top: 70, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold", mb: 1 }}
        noWrap
        title={props.testCase.name}
      >
        {props.testCase.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ whiteSpace: "pre-wrap" }}
      >
        {props.testCase.description || "No description available."}
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ flexShrink: 0, alignItems: "center", display: "flex", justifyContent: "center" }}>
          <img
            src={mobileImageUrl}
            alt="Mobile"
            style={{ width: '30vw', objectFit: "contain" }}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 2,
              fontSize: "0.85rem",
            }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                fullWidth
                required
                size="small"
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { fontSize: "0.85rem" } }}
                inputProps={{ style: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Additional Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { fontSize: "0.85rem" } }}
                inputProps={{ style: { fontSize: "0.85rem" } }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || submitted}
                size="small"
                sx={{ fontSize: "0.85rem" }}
              >
                {loading ? "Running..." : submitted ? "Submitted" : "Run"}
              </Button>
            </form>
          </Box>

          <Box sx={{ mt: 5 }}>
            <ButtonGroup size="small" variant="outlined" sx={{ mb: 1, width: '100%' }}>
              <Button
                variant={logView === "live" ? "contained" : "outlined"}
                onClick={() => setLogView("live")}
              >
                Live Logs
              </Button>
              <Button
                variant={logView === "history" ? "contained" : "outlined"}
                onClick={() => setLogView("history")}
              >
                History
              </Button>
            </ButtonGroup>

            <Box
              sx={{
                bgcolor: "#000",
                color: "#0f0",
                fontFamily: "monospace",
                fontSize: 12,
                p: 1,
                overflowY: "auto",
                borderRadius: 1,
                whiteSpace: "pre-wrap",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {logView === "live" ? "Live Logs" : "Test Run History"}
              </Typography>
              <pre>{logView === "live" ? liveLogs : historyLogs}</pre>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
