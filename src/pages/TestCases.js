import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TestCasesSubPanel from "../components/TestCasesSubPanel";
import TestCaseListPanel from "../components/TestCaseListPanel";
import CategoryListPanel from "../components/CategoryListPanel";

export default function TestCasesPage() {
  const [activeSub, setActiveSub] = useState("Test Cases");

  return (
    <Grid container sx={{ height: 'calc(100vh - 64px)', p:0, display: 'flex', flex: 1 }}>
      {/* Panel 2: Sub-navigation */}
      <Grid item sx={{ width: 180, borderRight: 1, borderColor: 'divider' }}>
        <TestCasesSubPanel selected={activeSub} onSelect={setActiveSub} />
      </Grid>
      {/* Panel 3+4: Test case list and form, all logic is inside TestCaseListPanel */}
      <Grid item xs={12} sx={{ display: "flex", flex: 1}}>
        {activeSub === "Test Cases" && <TestCaseListPanel />}
        {activeSub === "Categories" && <CategoryListPanel />}
      </Grid>
    </Grid>
  );
}
