import { useState, useEffect } from "react";
import {
    Button,
    Typography,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    Paper,
    IconButton,
    Skeleton,
    TextField,
} from "@mui/material";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { getAppStatusText } from "../util/Util";
import axios from "axios";

import { useOpeningStore } from "../util/stores/openingStore";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";

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
    // State to manage the sorting direction
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Placeholder function for handling the sort
    const handleSort = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const navigate = useNavigate();
    const [applications, setApplications] = useState<SingleApplicationProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const selectedOpening = useOpeningStore((state) => state.selectedOpening);
    const clearSelectedOpening = useOpeningStore((state) => state.clearSelectedOpening);
    const setSelectedApplicant = useApplicantStore((state) => state.setSelectedApplicant);
    const authStore = useAuthStore();
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

        navigate("/admin-acceptpage");
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

        navigate("/feedbacknote");
    };

    const generateRowFunction = (applications: SingleApplicationProps[]) => {
        return applications.map((application) => (
            <TableRow key={application.id}>
                <TableCell>{application.name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{getAppStatusText(application.status)}</TableCell>
                <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                    <div>
                        {application.status == "A" ? (
                            <Button
                                variant="outlined"
                                onClick={() => handleViewInterviewNotes(application.id)}
                            >
                                INTERVIEW NOTES
                            </Button>
                        ) : (
                            <div></div>
                        )}
                        <Button
                            sx={{ ml: 2 }}
                            variant="contained"
                            onClick={() => handleViewApplication(application.id)}
                        >
                            VIEW
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    useEffect(() => {
        if (!selectedOpening) {
            navigate("/viewrecruitmentround");
            return;
        }

        const fetchData = async () => {
            try {
                const applicationsResponse = await axios.get(
                    `http://127.0.0.1:3000/opening/${selectedOpening.id}/application` //Fixed not tested
                );
                console.log(selectedOpening);
                setApplications(applicationsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedOpening, navigate]);

    const handleBack = () => {
        clearSelectedOpening();
        navigate("/recruitment-details-page");
    };

    const respond = () => {
        // clearSelectedOpening();
        navigate("/view-interview-allocation");
    };

    const respond2 = () => {
      // clearSelectedOpening();
      navigate("/task-email-format");
  };

    const handleSendEmails = async () => {
        setLoading(true);
        try {
            // const response = await axios.post(`http://127.0.0.1:3000/send-interview-emails/${selectedOpening.id}`);
            // console.log(response);
            console.log("Commented out due to email limit");
        } catch (error) {
            console.error("Error sending emails:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            {/* Creates a button below allowing the user to add positions */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}>
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
                            console.log("Navigating to /task-email-format");
                            respond2();
                        }}
                    >
                        CONFIGURE EMAIL
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ ml: 2 }}
                        onClick={() => {
                            console.log("Navigating to /view-interview-allocation");
                            respond();
                        }}
                    >
                        VIEW CANDIDATE SUBMISSION STATUS
                    </Button>
                </div>
            </div>

            {/* creates a table showing all the number of applications for each recruitment round */}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
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

            <div style={{ marginTop: "50px" }}></div>

            {/* adds a table showing the number of applications for the current opening */}
            <Typography variant="h6" style={{ marginLeft: "10px", marginTop: "20px" }}>
                Opening Applications
            </Typography>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <TextField
                    style={{ width: "25%" }}
                    variant="outlined"
                    placeholder="Round Name, Deadline, etc..."
                    size="small"
                    label="Search"
                    fullWidth
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleSendEmails}
                    disabled={loading}
                    style={{ marginLeft: "1rem" }}
                >
                    {loading ? <Skeleton width={100} /> : "Send Availability Submission Emails"}
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Student Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>
                                Date of Submission
                                <Button
                                    onClick={handleSort}
                                    style={{
                                        minWidth: "30px",
                                        padding: "6px",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {sortDirection === "asc" ? "↓" : "↑"}
                                </Button>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
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
                                          <Skeleton variant="rectangular" width={80} height={30} />
                                      </TableCell>
                                  </TableRow>
                              ))
                            : generateRowFunction(applications)}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ViewOpenPage;
