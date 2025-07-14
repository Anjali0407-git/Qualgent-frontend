import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
const subItems = ["Test Cases", "Categories"];
const drawerWidth = 180;

export default function TestCasesSubPanel({ selected, onSelect }) {
    return (
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative", // This is KEY!
            },
        }}
        PaperProps={{ elevation: 1 }}
        >
        <List>
            {subItems.map(item => (
            <ListItemButton
                key={item}
                selected={selected === item}
                onClick={() => onSelect(item)}
            >
                <ListItemText primary={item} />
            </ListItemButton>
            ))}
        </List>
        </Drawer>
  );
}
