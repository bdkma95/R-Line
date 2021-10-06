import Menu from '../components/menu'

import {Box, Typography, Container} from '@material-ui/core'
import {createTheme, ThemeProvider } from '@material-ui/core/styles';

const mdTheme = createTheme();

export default function Home() {

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
      <Menu/>
        <Box
              component="main"
              sx={{
                  backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
              }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography> Welcome on Airnext Administration Web App</Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}