import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import PermissionButton from "./PermissionButton";
import RoleIcon from "../util/RoleIcon";

export interface TeamMember {
  email: string;
  role: string;
  profile_id: number;
}

interface TeamMembersTableProps {
  members: TeamMember[];
  onRemove: (profileId: number) => void;
  currentUserProfileId: number;
  userRole: string;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onRemove,
  currentUserProfileId,
  userRole,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.profile_id}>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RoleIcon role={member.role} />
                  {member.role}
                </div>
              </TableCell>
              <TableCell>
                {member.profile_id === currentUserProfileId
                  ? "Current User"
                  : userRole === "Owner" &&
                    member.profile_id !== currentUserProfileId && (
                      <PermissionButton
                        action="delete"
                        subject="Team"
                        onClick={() => onRemove(member.profile_id)}
                        tooltipText="You do not have permission to remove team members"
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Remove
                      </PermissionButton>
                    )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamMembersTable;
