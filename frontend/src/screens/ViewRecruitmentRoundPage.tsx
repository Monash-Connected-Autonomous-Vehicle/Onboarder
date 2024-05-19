import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Link } from "react-router-dom";
import { TableSortLabel } from "@mui/material";

const styles = {
  recruitmentRoundPage: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "1rem",
    textAlign: "left",
    height: "50px",
    display: "flex",
    alignItems: "center",
  },
  main: {
    padding: "2rem",
  },
  studentTeam: {
    color: "gray",
    marginBottom: "1rem",
  },
  section: {
    marginBottom: "2rem",
  },
  addRoundButton: {
    marginBottom: "1rem",
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  viewButton: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  scrollableTableBody: {
    height: "calc(100vh - 600px)",
    overflowY: "auto",
    display: "block",
  },
};

const ViewRecruitmentRoundPage = () => {
  const [data, setData] = useState([]);
  //const [sum, setSum] = useState(0)
  enum Status {
    A = "Active",
    I = "Inactive",
    R = "Archived",
  }

  useEffect(() => {
    console.log("useEffect");
    axios
      .get("http://127.0.0.1:3000/recruitmentRounds")
      .then((response) => {
        console.log("Response: ");
        console.log(response);
        setData(response.data); //.replaceAll("'", '"')
        console.log("setData done. Data:");
        console.log(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  return (
    <div style={styles.recruitmentRoundPage}>
      <header style={styles.header}>
        <h4>Onboarding: Recruitment Platform</h4>
      </header>
      <main style={styles.main}>
        <Typography variant="h4" style={styles.studentTeam}>
          Recruitment Rounds
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <div></div>
            {Array.isArray(data) &&
              data
                .map(
                  (item: any) =>
                    item.student_team_name.length > 0 ? (
                      <h3>{item.student_team_name}</h3>
                    ) : (
                      <h3>Name Not Found</h3>
                    ) // Code for if we need it, but defaults to dummy value
                )
                .at(0)}
            {/* <h3>'Student Team 1'</h3> */}
          </Grid>
        </Grid>
        <section style={styles.section}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <h4>Current Recruitment Rounds</h4>
            </Grid>
            <Grid item>
              <Link
                to="/addrecruitmentround"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" style={styles.addRoundButton}>
                  ADD ROUND
                </Button>
              </Link>
            </Grid>
          </Grid>
          <TextField
            style={{ marginBottom: "1rem", width: "25%" }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            fullWidth
          />
          {/* <Grid item xs={6} style={{ textAlign: "right" }}>
          </Grid> */}
          <TableContainer component={Paper} style={styles.scrollableTableBody}>
            <Table style={styles.table} stickyHeader>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>
                    Deadline
                    <TableSortLabel></TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Add active recruitment rounds rows */}
                {Array.isArray(data) &&
                  data
                    .filter((item: any) => item.status != "R")
                    .map((item: any) => {
                      const deadline = new Date(item.deadline);
                      const formattedDeadline = `${deadline
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(deadline.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${deadline.getFullYear()} ${deadline
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${deadline
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.student_team_name + " " + item.id}
                          </TableCell>
                          <TableCell>{formattedDeadline}</TableCell>
                          <TableCell>
                            {Status[item.status as keyof typeof Status] ||
                              "Unknown Status"}
                          </TableCell>
                          <TableCell>{item.semester}</TableCell>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.openings_count}</TableCell>
                          <TableCell>
                            <Button variant="contained" style={{ padding: 0 }}>
                              VIEW
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
        <section style={styles.section}>
          <h4>Archived Recruitment Rounds: Showing 3</h4>
          <TextField
            style={{ marginBottom: "1rem", width: "25%" }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            fullWidth
          />
          <TableContainer component={Paper}>
            <Table style={styles.table} stickyHeader>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(data) &&
                  data
                    .filter((item: any) => item.status == "R")
                    .slice(0, 3)
                    .map((item: any) => {
                      const deadline = new Date(item.deadline);
                      const formattedDeadline = `${deadline
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(deadline.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${deadline.getFullYear()} ${deadline
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${deadline
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.student_team_name + " " + item.id}
                          </TableCell>
                          <TableCell>{formattedDeadline}</TableCell>
                          <TableCell>
                            {Status[item.status as keyof typeof Status] ||
                              "Unknown Status"}
                          </TableCell>
                          <TableCell>{item.semester}</TableCell>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.openings_count}</TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </main>
    </div>
  );
};

export default ViewRecruitmentRoundPage;