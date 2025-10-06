import React, { useEffect, useState } from "react"
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material"
import { employerService } from "../../services/employerService"

export default function InterviewPage() {
  const [interviews, setInterviews] = useState([])

  useEffect(() => {
    employerService.getInterviews().then((res) => setInterviews(res.data || []))
  }, [])

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Lịch phỏng vấn
      </Typography>
      <List>
        {interviews.map((i) => (
          <ListItem key={i.id} secondaryAction={<Button>Xem chi tiết</Button>}>
            <ListItemText primary={`${i.candidateName} - ${i.jobTitle}`} secondary={`Thời gian: ${i.date}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
