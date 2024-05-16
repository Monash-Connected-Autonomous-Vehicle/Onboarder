import React, { useState } from 'react';
import { Grid, Button, Typography, TextField, Box, Autocomplete, Chip } from '@mui/material';

function CreateOpeningPage() {
    const [openingName, setOpeningName] = useState('');
    const [roundName, setRoundName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [skills, setSkills] = useState([]);

    const handleSubmit = () => {
        alert('Opening has successfully been created!');
    };

    const handleCancel = () => {
        setOpeningName('');
        setRoundName('');
        setDescription('');
        setDeadline('');
        setSkills([]);
        alert('Form Canceled');
    };

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Typography variant='h3' textAlign="center">Create Opening</Typography>
          </Grid>

          <Grid item xs={6} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body2' fontSize={30}>Name:</Typography>
              <TextField
                fullWidth
                label='Enter Opening Name'
                size='small'
                value={openingName}
                onChange={(e) => setOpeningName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' fontSize={30}>For Round:</Typography>
              <TextField
                fullWidth
                label='Enter Round Name'
                size='small'
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid item xs={6} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body2' fontSize={30}>Description:</Typography>
              <TextField
                fullWidth
                label='Enter Opening Description'
                size='small'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' fontSize={30}>Deadline:</Typography>
              <TextField
                fullWidth
                label='Enter Deadline'
                size='small'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='body2' fontSize={30}>Skills:</Typography>
            <Autocomplete
              fullWidth
              multiple
              freeSolo
              options={[]}
              value={skills}
              onChange={(event, newValue) => {
                setSkills(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add skills"
                  sx={{ width: '50%' }}
                />
              )}
            />
          </Grid>

          <Grid item container xs={12} justifyContent="center" spacing={2}>
            <Grid item>
              <Button variant='contained' color='primary' onClick={handleSubmit}>Submit</Button>
            </Grid>
            <Grid item>
              <Button variant='contained' color='warning' onClick={handleCancel}>Cancel</Button>
            </Grid>
          </Grid>
        </Grid>
    );
}

export default CreateOpeningPage;
