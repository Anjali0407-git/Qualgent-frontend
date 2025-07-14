import React, { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Checkbox, CircularProgress, LinearProgress, IconButton, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [uploadingFiles, setUploadingFiles] = useState([]); // {id, name, progress, cancelToken}

  const inputRef = useRef(null);

  // Fetch files list
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle selection toggle
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Delete selected files
  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected file(s)?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          axios.delete(`${API}/api/files/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSelectedIds(new Set());
      fetchFiles();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Upload files handler
  const handleUploadFiles = (event) => {
    const newFiles = Array.from(event.target.files);
    newFiles.forEach(uploadFile);
    event.target.value = null; // reset input
  };

  // Upload a single file to backend + Azure blob
  const uploadFile = (file) => {
    const source = axios.CancelToken.source();
    const id = `${file.name}-${Date.now()}`;

    setUploadingFiles((ufs) => [
      ...ufs,
      { id, name: file.name, progress: 0, cancelToken: source },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${API}/api/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadingFiles((ufs) =>
            ufs.map((f) => (f.id === id ? { ...f, progress } : f))
          );
        },
      })
      .then(() => {
        setUploadingFiles((ufs) => ufs.filter((f) => f.id !== id));
        fetchFiles();
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log(`Upload canceled: ${file.name}`);
        } else {
          console.error("Upload failed", error);
        }
        setUploadingFiles((ufs) => ufs.filter((f) => f.id !== id));
      });
  };

  // Cancel an ongoing upload
  const cancelUpload = (id) => {
    const uploadingFile = uploadingFiles.find((f) => f.id === id);
    if (uploadingFile) uploadingFile.cancelToken.cancel();
    };

  return (
    <Box sx={{ p: 4, background: 'transparent'}}>
      <Typography variant="h5" gutterBottom>
        Files
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => inputRef.current.click()}
          disabled={uploadingFiles.length > 0}
        >
          Upload New Files
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={selectedIds.size === 0}
          onClick={deleteSelected}
        >
          Delete Selected ({selectedIds.size})
        </Button>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleUploadFiles}
        />
      </Box>

      {uploadingFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {uploadingFiles.map(({ id, name, progress }) => (
            <Paper
              key={id}
              sx={{
                p: 1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              elevation={2}
            >
              <Typography variant="body2" sx={{ mr: 2, flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                Uploading: {name}
              </Typography>
              <Box sx={{ width: "50%", mr: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <IconButton onClick={() => cancelUpload(id)} size="small" color="error">
                <CancelIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.size > 0 && selectedIds.size === files.length}
                  indeterminate={selectedIds.size > 0 && selectedIds.size < files.length}
                  onChange={(e) =>
                    e.target.checked
                      ? setSelectedIds(new Set(files.map((f) => f._id)))
                      : setSelectedIds(new Set())
                  }
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Size (KB)</TableCell>
              <TableCell>Date Uploaded</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {files.map((file) => (
              <TableRow key={file._id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(file._id)}
                    onChange={() => toggleSelect(file._id)}
                  />
                </TableCell>
                    <TableCell>
                  {file.name}
                  <IconButton
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    title="Open file in new tab"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>{(file.size / 1024).toFixed(1)}</TableCell>
                <TableCell>{new Date(file.createdAt).toLocaleString()}</TableCell>
                
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (!window.confirm("Delete this file?")) return;
                      try {
                        await axios.delete(`${API}/api/files/${file._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchFiles();
                        setSelectedIds((ids) => {
                          const newIds = new Set(ids);
                          newIds.delete(file._id);
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
