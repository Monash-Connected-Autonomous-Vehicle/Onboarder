import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";

export interface SingleApplicationProps {
  id: number;
  opening_id: number;
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  course_enrolled: string;
  major_enrolled: string;
  cover_letter: string;
  skills: string[];
  status: string;
  created_at: string;
}

function ViewOpenPage() {
  // State hooks
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState(null);
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [expandedApplicants, setExpandedApplicants] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState(false);
  const [expandedRecruits, setExpandedRecruits] = useState(false);
  const [confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);

  // Constants
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

  // Store hooks
  const authStore = useAuthStore();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const setSelectedApplicant = useApplicantStore(
    (state) => state.setSelectedApplicant,
  );
  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
  // Effect hooks
  useEffect(() => {
    if (!selectedOpening) {
      navigate("/view-recruitment-rounds");
      return;
    }

    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`, // Working
        );
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate]);

  // Handler functions
  const handleViewApplication = (applicationId: number) => {
    setSelectedApplicant({
      opening_name: selectedOpening?.title ?? null,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening?.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening?.id ?? null,
      recruitment_round_id: selectedOpening?.recruitment_round_id ?? null,
      student_team_name: selectedOpening?.student_team_name ?? null,
      opening_title: selectedOpening?.title ?? null,
      application_count: selectedOpening?.application_count ?? null,
    });

    navigate("/review-applicant");
  };

  const handleViewInterviewNotes = (applicationId: number) => {
    setSelectedApplicant({
      opening_name: selectedOpening?.title ?? null,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening?.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening?.id ?? null,
      recruitment_round_id: selectedOpening?.recruitment_round_id ?? null,
      student_team_name: selectedOpening?.student_team_name ?? null,
      opening_title: selectedOpening?.title ?? null,
      application_count: selectedOpening?.application_count ?? null,
    });

    navigate("/interview-feedback");
  };

  const handleBack = () => {
    clearSelectedOpening();
    navigate("/recruitment-round-details");
  };

  const respond = () => {
    // clearSelectedOpening();
    navigate("/interview-scheduling");
  };

  const respond2 = () => {
    // clearSelectedOpening();
    navigate("/task-email-format");
  };

  const handleClickOpen = () => {
    setConfirmEmailModalOpen(true);
  };

  const handleClose = () => {
    setConfirmEmailModalOpen(false);
  };

  const handleSendEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_API_URL}/send-interview-emails/${selectedOpening.id}`,
      );
      // console.log(response);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
    setLoading(false);
    handleClose();
  };

  const handleConfirmSendEmails = () => {
    handleClickOpen();
  };

  const filterApplications = (status: string) =>
    applications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase(),
    );

  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    if (applications.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No data available for this category.
          </TableCell>
        </TableRow>
      );
    }

    return applications.map((application) => (
      <TableRow key={application.id}>
        <TableCell>{application.name}</TableCell>
        <TableCell>{application.email}</TableCell>
        <TableCell>{getAppStatusText(application.status)}</TableCell>
        <TableCell>
          {new Date(application.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {(application.status === "Candidate" ||
              application.status === "Recruit") && (
              <Button
                variant="outlined"
                onClick={() => handleViewInterviewNotes(application.id)}
              >
                INTERVIEW NOTES
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => handleViewApplication(application.id)}
            >
              VIEW APPLICATION
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  const renderCategorySection = (
    title: string,
    status: string,
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
    tooltipText: string,
  ) => {
    const filteredApplications = filterApplications(status);

    return (
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={tooltipText}>
              <IconButton size="small" sx={{ mr: 1 }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {title}
            </Typography>
          </Box>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {loading
                  ? [...Array(3)].map((_, index) => (
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
                          <Skeleton
                            variant="rectangular"
                            width={200}
                            height={36}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : generateRowFunction(filteredApplications)}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    );
  };

  return (
    <div>
      {/* Creates a button below allowing the user to add positions */}
      <div
        style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}
      >
        <IconButton onClick={() => handleBack()}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: "10px" }}>
          {selectedOpening?.title}
        </Typography>

        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="outlined"
            onClick={() => {
              // console.log("Navigating to /task-email-format");
              respond2();
            }}
          >
            CONFIGURE INTERVIEW SCHEDULING EMAIL
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              // console.log("Navigating to /interview-scheduling");
              respond();
            }}
          >
            INTERVIEW SCHEDULE
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Applications Received for Opening</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}</TableCell>
              <TableCell>{selectedOpening?.application_count}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Opening Applications
        </Typography>
        <Button
          variant="contained"
          onClick={handleConfirmSendEmails}
          disabled={
            loading ||
            applications.find((item) => item.status === "C") == undefined
          }
          style={{ marginLeft: "1rem" }}
        >
          {loading ? (
            <Skeleton width={100} />
          ) : (
            "Send Interview Scheduling Emails"
          )}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Student Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date of Submission</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Dialog
        open={confirmEmailModalOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Send Interview Scheduling Emails"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to send interview scheduling emails? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendEmails} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {renderCategorySection(
        "Applicants",
        "A",
        expandedApplicants,
        setExpandedApplicants,
        "Applicants are students who have submitted an application.",
      )}
      {renderCategorySection(
        "Candidates",
        "C",
        expandedCandidates,
        setExpandedCandidates,
        "Candidates have had their application accepted, and have made it to the interview stage.",
      )}
      {renderCategorySection(
        "Recruits",
        "R",
        expandedRecruits,
        setExpandedRecruits,
        "Recruits have completed their interview and were accepted to be a part of the team.",
      )}
    </div>
  );
}

export default ViewOpenPage;
