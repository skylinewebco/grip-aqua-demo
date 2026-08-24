/* GRIP — React entry point (standalone page, mounted from grip.html) */
import React from "react";
import { createRoot } from "react-dom/client";
import GripExperience from "./GripExperience.jsx";

createRoot(document.getElementById("grip-root")).render(<GripExperience />);
