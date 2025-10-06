import React, { useEffect, useState } from "react"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { employerService } from "../../services/employerService"

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    employerService.getApplicants().then((res) => {
      setApplicants(res.data || [])
    })
  }, [])

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Ứng viên đã ứng tuyển
      </Typography>
      <List>
        {applicants.map((a) => (
          <ListItem key={a.id}>
            <ListItemText primary={a.fullName} secondary={`Ứng tuyển vào: ${a.jobTitle}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
