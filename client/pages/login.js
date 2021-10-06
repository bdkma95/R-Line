import { useRouter } from 'next/router';
import { useState } from 'react'
import {login} from '../apiServices/userServices'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useCookies } from "react-cookie"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://airnext.io" target="_blank">
        Airnext.io
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

  export default function Login() {
    const [cookie, setCookie] = useCookies(["user"])
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e) {
      e.preventDefault()

      if (errorMsg) setErrorMsg('')

      const email = e.currentTarget.username.value;
      const password = e.currentTarget.password.value;


      try {
        const res = await login(email,password);
        if (res.status === 200) {
          setCookie("user", JSON.stringify(res.data.token), {
              path: "/",
              maxAge: 3600, // Expires after 1hr
              sameSite: true,
          })
          router.push('/home')
        } else {
          throw new Error(await res.text())
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
        setErrorMsg(error.message)
      }
    }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "linear-gradient(45deg, #0070c2 0%, #49a377 100%) !important",
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#49a377' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
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
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Login
      </Button>
      <Copyright sx={{ mt: 5 }} />
    </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}