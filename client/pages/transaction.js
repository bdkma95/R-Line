import Head from 'next/head'
import React, { useState } from 'react'
import {abi} from '../conf/AirnectToken'

import services from '../apiServices/userServices'
import {createTheme, ThemeProvider } from '@material-ui/core/styles'

import {Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Card, CardContent, Box, Typography, Container, Link} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const mdTheme = createTheme();

import Menu from '../components/menu';

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

export default function OwnerContract() {
  const [params, setParams] = useState(abi); 
  const [sender, setSender] = useState(null)


  function handleChange(e,row,functName){
    const newParams = params.map(param=>{
       if(param.name===functName){
          for(let n in param.inputs){
            if(param.inputs[n].name===row.name){
                param.inputs[n].value = e.target.value;
              }
            }
          }
        return param
    })
    setParams(newParams)
  }

  const callFunction = (param) =>{
        services.callMethods(param).then(response => {
                const newParams = params.map(p=>{
                    if(p.name===param.name){
                        p.result = response.data
                    }
                    return p
                })
                console.log(newParams)
                setParams(newParams)
              });
    }

  const manageRow = (param) => {
   return  param.inputs.map((row) => (                           
      <TableRow key={row.name} style={{height:"35%",width:"20%"}}>
           <TableCell align="right"> {row.type}</TableCell>
           <TableCell align="right">{row.name}</TableCell>
           <TableCell align="right">{
                            <TextField id="standard-basic" label={row.name} value={row.value} onChange={(e)=>handleChange(e,row,param.name)}/>
            }
          </TableCell>
      </TableRow>
    ))
  }

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
            
          <TextField id="standard-basic" label={"Sender"} value={sender} onChange={(e)=>setSender(e.target.value)}/>   
          <div style={{marginTop:"1%", width:"90%"}}>
          {params && params !== undefined && params.map(param=>{
             if(param.type==="event") return; 
              return  <div>
<br/>
                      <Accordion key={param.name!==undefined?param.name:param.type} style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                         <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                          >
                                   <Typography >{param.name!==undefined?param.name:param.type}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                        <div style={{display:"flex",
	                                  flexDirection: "row",
	                                  flexWrap: "nowrap",
	                                  justifyContent: "center",
	                                  alignItems: "flex-end",
	                                  alignContent: "stretch"}}>
                          <div>
                              {param.inputs.length>0 &&  <Typography>
                                    Inputs : 
                                        <TableContainer component={Paper} style={{width:"39vw"}}>
                                          <Table aria-label="simple table">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell align="right">Type</TableCell>
                                                <TableCell align="right">Name</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {manageRow(param)}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                  </Typography>}
                               <Button variant="contained" style={{width:"100%"}} onClick={()=>callFunction(param)}>Submit</Button>
                          </div>
                                  <Card style={{marginLeft:"1%"}}>
                                      <CardContent>
                                        <Typography variant="body2" component="p">
                                            {param.result?
                                                  JSON.stringify(param.result, null, 2).length>300?
                                                      <div style={{width:"47vw", height:"49vh",overflowX:"auto"}}>
                                                              {JSON.stringify(param.result, null, 2)}
                                                      </div>:
                                                      <div style={{width:"47vw", height:"9vh",overflowX:"auto"}}>
                                                              {JSON.stringify(param.result, null, 2)}
                                                      </div>
                                                      :<div style={{width:"47vw", height:"9vh",overflowX:"auto"}}/>

                                            }
                                        </Typography>
                                      </CardContent>
                                    </Card>
                        </div>
                          </AccordionDetails>
                        </Accordion>    
                    </div>
               })
          }
        </div>
        <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}