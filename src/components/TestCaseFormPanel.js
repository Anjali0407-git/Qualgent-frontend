import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import axios from "axios";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function TestCaseFormPanel({ editTestCase, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    files: [], // selected file IDs
    ...editTestCase,
  });

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_URL;

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      setLoadingCats(true);
      try {
        const res = await axios.get(`${API}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, [token, API]);

  // Fetch files for selection
  useEffect(() => {
    async function fetchFiles() {
      setLoadingFiles(true);
      try {
        const res = await axios.get(`${API}/api/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Failed to load files", err);
      } finally {
        setLoadingFiles(false);
      }
    }
    fetchFiles();
  }, [token, API]);

  // Handle form change
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Toggle file selection
  const toggleFileSelection = (fileId) => {
    setForm((f) => {
      const selectedFiles = new Set(f.files || []);
      if (selectedFiles.has(fileId)) selectedFiles.delete(fileId);
      else selectedFiles.add(fileId);
      return { ...f, files: Array.from(selectedFiles) };
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        files: form.files,
      };

      if (editTestCase?._id) {
        await axios.put(`${API}/api/testcases/${editTestCase._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/api/testcases`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSaved();
    } catch (err) {
      console.error("Failed to save test case", err);
    }
  };

  return (
    <Paper sx={{ width: 480, p: 2, ml: 4, mr: 0, boxShadow: 3, ml: 1, position: "relative", overflowY: "auto", maxHeight: '90vh' }}>
      <Typography variant="h6" gutterBottom>
        {editTestCase ? "Edit Test Case" : "Create Test Case"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Category"
          name="category"
          value={form.category || ""}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loadingCats}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Existing Files
          </Typography>
          {loadingFiles ? (
            <CircularProgress size={24} />
          ) : files.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No files available.
            </Typography>
          ) : (
            <FormGroup sx={{ maxHeight: 180, overflowY: "auto", border: "1px solid #ddd", borderRadius: 1, p: 1 }}>
              {files.map((file) => (
                <FormControlLabel
                  key={file._id}
                  control={
                    <Checkbox
                      checked={(form.files || []).includes(file._id)}
                      onChange={() => toggleFileSelection(file._id)}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ mr: 1 }}>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </Typography>
                      <Tooltip title="Open file in new tab">
                        <IconButton
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ p: 0.5 }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                    />
              ))}
            </FormGroup>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
