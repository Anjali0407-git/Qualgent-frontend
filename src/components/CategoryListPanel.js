import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress
} from "@mui/material";
import EditIcon   from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function CategoryListPanel() {
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showDialog, setShowDialog]     = useState(false);
  const [dialogMode, setDialogMode]     = useState("create"); // or "edit"
  const [currentCat, setCurrentCat]     = useState(null);
  const [name, setName]                 = useState("");
  const [description, setDescription]   = useState("");
  const [saving, setSaving]             = useState(false);
  const token = localStorage.getItem("token");
  const API   = process.env.REACT_APP_API_URL;

    useEffect(() => { 
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

  const openCreate = () => {
    setDialogMode("create");
    setCurrentCat(null);
    setName("");
    setDescription("");
    setShowDialog(true);
  };

  const openEdit = (cat) => {
    setDialogMode("edit");
    setCurrentCat(cat);
    setName(cat.name);
    setDescription(cat.description);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) return;
    setSaving(true);
    try {
      if (dialogMode === "create") {
        const res = await axios.post(
          `${API}/api/categories`,
          { name, description },
          { headers: { Authorization: `Bearer ${token}` } }
          );
          setCategories(prev => [res.data, ...prev]);
      } else {
        const res = await axios.put(
          `${API}/api/categories/${currentCat._id}`,
          { name, description },
          { headers: { Authorization: `Bearer ${token}` } }
          );
          setCategories(prev =>
          prev.map(cat => cat._id === res.data._id ? res.data : cat)
        );
      }
      
      setShowDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ flex: 1, p: 5, overflowX: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Categories</Typography>
        <Button variant="contained" size="small" onClick={openCreate}>
          + New Category
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(cat)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cat._id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === "create" ? "Create New Category" : "Edit Category"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name?.trim() || !description?.trim()}
            variant="contained"
          >
            {saving ? "Saving..." : dialogMode === "create" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
