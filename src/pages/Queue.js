import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Button,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/queues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueues(res.data);
    } catch (err) {
      console.error("Failed to fetch queues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected queue(s)?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          axios.delete(`${API}/api/queues/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSelectedIds(new Set());
      fetchQueues();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "white", height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Queues
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={selectedIds.size === 0}
          onClick={deleteSelected}
        >
          Delete Selected ({selectedIds.size})
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.size > 0 && selectedIds.size === queues.length}
                  indeterminate={selectedIds.size > 0 && selectedIds.size < queues.length}
                  onChange={(e) =>
                    e.target.checked
                      ? setSelectedIds(new Set(queues.map((q) => q._id)))
                      : setSelectedIds(new Set())
                  }
                />
              </TableCell>
              <TableCell>Test Case Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Started</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {queues.map((queue) => (
              <TableRow key={queue._id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(queue._id)}
                    onChange={() => toggleSelect(queue._id)}
                  />
                </TableCell>
                <TableCell>{queue.taskName}</TableCell>
                <TableCell>{queue.status}</TableCell>
                <TableCell>{new Date(queue.date_started).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (!window.confirm("Delete this queue?")) return;
                      try {
                        await axios.delete(`${API}/api/queues/${queue._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchQueues();
                        setSelectedIds((ids) => {
                          const newIds = new Set(ids);
                          newIds.delete(queue._id);
                          return newIds;
                        });
                      } catch (err) {
                        console.error("Delete failed", err);
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
