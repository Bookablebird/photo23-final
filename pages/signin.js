import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, signInWithGoogle } from '@lib/firebase'
import { useAuth } from '@contexts/auth'


import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import GoogleIcon from '@mui/icons-material/Google'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const SignInPage = () => {
  const router = useRouter()
  const [user, userLoading] = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })

  if (userLoading) {
    return null
  }

  if (user && typeof window !== 'undefined') {
    router.push('/')
    return null
  }

  const handleChange = (e) => {
    const id = e.target.id
    const newValue = e.target.value

    setValues({ ...values, [id]: newValue })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let missingValues = []
    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        missingValues.push(key)
      }
    })

    if (missingValues.length > 1) {
      alert(`You're missing these fields: ${missingValues.join(', ')}`)
      return
    }

    signIn(values.email, values.password).catch((err) => {
      alert(err)
    })
  }

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © Photo23 '}
      </Typography>
    )
  }
  
  const theme = createTheme()

    return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color='error'
                  sx={{ mt: 3 }}
                  endIcon={<GoogleIcon/>}
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 3 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      )
    }

export default SignInPage
