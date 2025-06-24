import React from "react";
import {
    Drawer,
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const routes = [
    { text: "Dashboard", path: "/" },
    { text: "Gastos", path: "/expenses" },
    { text: "Ingresos", path: "/ingresos" },
    { text: "Configuracion", path: "/configuracion" },
];

const Sidebar = () => {
    return (
        <>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
                {routes.map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            {/* Puedes agregar más items aquí */}
        </Drawer>
        </>
    );
};

export default Sidebar;
