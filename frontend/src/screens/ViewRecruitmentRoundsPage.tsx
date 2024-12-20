import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Skeleton,
  IconButton,
} from "@mui/material";
import axios from "axios";
import BackIcon from "../assets/BackIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import { getBaseAPIURL } from "../util/Util";
import React from "react";
import PermissionButton from "../components/PermissionButton";
import ConfigureInterviewLinkModal from "../components/ConfigureInterviewLinkModal";

// Css style file
// const styles = {
//   scrollableTableBody: {
//     // height: "calc(100vh - 650px)",
//     maxHeight: "calc(4 * 69.5px + 57px)",
//     minHeight: "69.5px",
//     overflowY: "auto",
//     display: "block",
//   },
// };

// Css style for the modal
// const styleLink = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 700,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
// };

const ViewRecruitmentRoundsPage = () => {
  // State hooks
  // Modal Link modify
  const [urlLink, setUrlLink] = useState("");
  const [isEditLinkModalOpen, setOpenLink] = React.useState(false);
  const handleOpenLink = () => setOpenLink(true);
  const handleCloseLinkModal = () => setOpenLink(false);
  const navigate = useNavigate();
  const [filter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddRoundClick = () => {
    navigate("/add-recruitment-round");
  };

  // Constants
  enum Status {
    A = "Active",
    I = "Inactive",
    R = "Archived",
  }
  const SHOW_ARCHIVED_AMOUNT = 3;
  const authStore = useAuthStore();
  const studentTeamId = authStore.team_id;
  const BASE_API_URL = getBaseAPIURL();
  const API_URL = `${BASE_API_URL}/student-team/${studentTeamId}/recruitment-round`; // Working

  // Store hooks
  const studentTeamStore = useStudentTeamStore();

  const setRecruitmentDetails = useRecruitmentStore(
    (state) => state.setRecruitmentDetails,
  );

  // Effects hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);

        setData(response.data);
        setUrlLink(
          studentTeamStore.studentTeams.find(
            (item) => item.student_team_id == authStore.team_id,
          )?.student_team_meeting_link || "",
        );
      } catch (error) {
        console.error("There was an error!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler functions

  const handleViewRound = (id: number) => {
    setRecruitmentDetails({
      roundId: id,
      roundApplicationDeadline: null,
      roundInterviewPreferenceDeadline: null,
      roundInterviewPeriod: null,
      roundName: null,
      roundStatus: null,
    });
    navigate("/recruitment-round-details");
  };

  const handleAllocateTeamLeads = () => {
    navigate("/view-team-leads");
  };

  const handleViewTeamMembers = () => {
    navigate("/view-team-members");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleEditLink = async (urlLink: string) => {
    try {
      await axios.patch(`${BASE_API_URL}/student-team/${studentTeamId}`, {
        meeting_link: urlLink,
      });
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterData = (round: any) => {
    const { student_team_name, id, status, semester, year, openings_count } =
      round;
    const statusText =
      Status[status as keyof typeof Status] || "Unknown Status";

    return [
      `${student_team_name} ${id}`,
      statusText,
      semester,
      year,
      openings_count,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].some((value: any) =>
      value.toString().toLowerCase().includes(filter.toLowerCase()),
    );
  };

  return (
    <div>
      <main>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
        >
          <Box display="flex" alignItems="baseline">
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4">
              {authStore.team_name + " Recruitment Rounds"}
            </Typography>
          </Box>
          <Grid>
            <ConfigureInterviewLinkModal
              open={isEditLinkModalOpen}
              onClose={handleCloseLinkModal}
              onEditLink={handleEditLink}
              urlLinkIn={urlLink}
            />
          </Grid>

          <Box>
            <Button
              variant="contained"
              onClick={handleOpenLink}
              style={{ marginRight: "10px" }}
            >
              Configure Interview Link
            </Button>

            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={handleViewTeamMembers}
            >
              View Team Members
            </Button>

            <PermissionButton
              action="assign"
              subject="TeamLead"
              variant="contained"
              color="primary"
              onClick={handleAllocateTeamLeads}
              tooltipText="You do not have permission to allocate team leads"
            >
              Allocate Team Leads
            </PermissionButton>
          </Box>
        </Box>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ mb: 2, ml: 8, mt: 1 }}>
              {"Team Description: " +
                studentTeamStore.studentTeams.find(
                  (item) => item.student_team_id === authStore.team_id,
                )?.student_team_description}
            </Typography>
          </Grid>
        </Grid>
        {/* <Typography variant="h5">Recruitment Rounds</Typography> */}
        <section>
          <Grid
            container
            alignItems="baseline"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Grid item xs={6}>
              {/* <TextField
                style={{ marginBottom: "1rem", width: "25%" }}
                variant="outlined"
                placeholder="Round Name, ApplicationDeadline, etc..."
                size="small"
                label="Search"
                fullWidth
                onChange={(e) => setFilter(e.target.value)}
              /> */}
              <Grid container alignItems="baseline">
                <Grid item>
                  <Typography variant="h5" mr={2}>
                    Active Recruitment Rounds
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Showing{" "}
                    {
                      data.filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (item: any) => item.status == "I" || item.status == "A",
                      ).length
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <PermissionButton
                action="create"
                subject="Round"
                onClick={handleAddRoundClick}
                variant="contained"
                tooltipText="You don't have permission to add a recruitment round"
              >
                ADD ROUND
              </PermissionButton>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={30}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : data
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .filter((item: any) => item.status != "R")
                      .filter(filterData)
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((item: any) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {authStore.team_name + " " + item.id}
                            </TableCell>

                            <TableCell>
                              {Status[item.status as keyof typeof Status] ||
                                "Unknown Status"}
                            </TableCell>
                            <TableCell>{item.semester}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.openings_count}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  handleViewRound(item.id);
                                }}
                              >
                                VIEW ROUND
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
        <section>
          <Grid container alignItems="baseline" sx={{ mb: 1, mt: 2 }}>
            <Grid item>
              <Typography variant="h5" mr={2}>
                Archived Recruitment Rounds
              </Typography>
            </Grid>
            <Grid item>
              {/* <Typography variant="subtitle2">
                Showing{" "}
                {data.filter((item: any) => item.status == "R").length < 3
                  ? data.filter((item: any) => item.status == "R").length
                  : SHOW_ARCHIVED_AMOUNT}{" "}
                of {data.filter((item: any) => item.status == "R").length}
              </Typography> */}
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableRow>
                    ))
                  : data
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .filter((item: any) => item.status == "R")
                      .slice(0, SHOW_ARCHIVED_AMOUNT)
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((item: any) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {authStore.team_name + " " + item.id}
                            </TableCell>
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

export default ViewRecruitmentRoundsPage;
