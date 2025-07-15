import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";
import TestCaseStatusPanel from "../components/TestCaseStatusPanel";

export default function RunTestCases() {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runTestCase, setRunTestCase] = useState(null);

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/testcases/search`,
        { query: searchQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestCases(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  // Fetch test cases list
  const fetchTestCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/testcases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestCases(res.data);
    } catch (err) {
      console.error("Failed to load test cases", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  return (
    <Box sx={{ flex: 1, display: "flex"}}>
      <Box sx={{ p: 5, overflowX: "auto", maxWidth: runTestCase ? "25vw" : "100%", flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Run Test Cases</Typography>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search test cases in natural language. Eg: tests of 'unit-test' category"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <Button variant="contained" onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
            Search
          </Button>
          <Button variant="outlined" onClick={() => { setSearchQuery(''); fetchTestCases(); }}>
            Reset
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Files</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
                {testCases.map((tc) => {
                  const fileNames = (tc.files || []).map((f) => f.name).join(", ");
                  return (
                    <TableRow key={tc._id}>
                      <TableCell>{tc.name}</TableCell>
                      <TableCell>{tc.category?.name || "—"}</TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tc.files?.length ? (
                      tc.files.map((file, idx) => (
                        <Tooltip key={file._id} title={file.name}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 8, display: "inline-flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
                          >
                            {file.name}
                            <OpenInNewIcon fontSize="small" sx={{ ml: 0.3 }} />
                            {idx < tc.files.length - 1 && ","}
                          </a>
                        </Tooltip>
                      ))
                    ) : (
                      "—"
                    )}
                  </TableCell>
                      <TableCell>
                        {new Date(tc.updatedAt || tc.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Run Test Case">
                          <IconButton
                            size="small"
                            onClick={() => setRunTestCase(tc)}
                            color="primary"
                          >
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </Box>
      {runTestCase && (
        <TestCaseStatusPanel
          testCase={runTestCase}
          onClose={() => setRunTestCase(null)}
        />
      )}
    </Box>
  );
}
