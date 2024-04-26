import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Avatar, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MapIcon from '@mui/icons-material/Map';

const IncidentCard = ({ title }) => (
  <Card sx={{ width: '100%', maxWidth: 345, m: 2, backgroundColor: '#f5f5f5', overflow: 'visible' }}>
    <Grid container spacing={2} alignItems="center" sx={{ ml: 2, mr: 2, mt: 1 }}>
      <Grid item>
        <Avatar src="/public/images/profile.jfif" alt="Reporter" sx={{ width: 56, height: 56 }} />
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          Alexandr T.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reported on 20.04.2024 at 16:30
        </Typography>
      </Grid>
    </Grid>
    <CardMedia
      component="img"
      height="140"
      image="/public/images/incidentimage1.png"
      alt="Incident Scene"
      sx={{ mt: 1, mb: 1 }}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Friedrichstraße 55, Hamburg
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <IconButton aria-label="like" color="primary">
          <ThumbUpIcon />
          <span>10</span>
        </IconButton>
        <IconButton aria-label="dislike" color="error">
          <ThumbDownIcon />
          <span>5</span>
        </IconButton>
        <IconButton color="default">
          <MapIcon />
          <Typography variant="caption" display="block">
            Go to map
          </Typography>
        </IconButton>
      </div>
    </CardContent>
  </Card>
);

export default IncidentCard
