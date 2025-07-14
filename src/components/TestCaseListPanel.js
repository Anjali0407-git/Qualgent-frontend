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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";
import TestCaseFormPanel from "./TestCaseFormPanel";

export default function TestCaseListPanel() {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_URL;

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

  const editingTestCase = testCases.find((tc) => tc._id === editId) || null;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test case?")) return;

    try {
      await axios.delete(`${API}/api/testcases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestCases((prev) => prev.filter((tc) => tc._id !== id));
    } catch (err) {
      console.error("Failed to delete test case", err);
    }
  };

  return (
    <Box sx={{ flex: 1, overflowX: "auto", display: "flex" }}>
      <Box sx={{ flex: 1, p: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Test Cases</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
            }}
          >
            + New
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
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditId(tc._id);
                            setShowForm(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(tc._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Form Panel */}
      {showForm && (
        <TestCaseFormPanel
          editTestCase={editingTestCase}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchTestCases();
          }}
        />
      )}
    </Box>
  );
}
