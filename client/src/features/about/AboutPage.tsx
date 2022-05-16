import React, {useState} from 'react';
import {Alert, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import agent from "../../app/api/agent";
import {log} from "util";

const AboutPage = () => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const getValidationErrors = () => {
        agent.TestErrors.GetValidationError().then(() => console.log('should not see this')).catch(error => setValidationErrors(error));
    }
    return (
        <Container>
            <Typography variant="h2"> Errors for testing purposes</Typography>
            <ButtonGroup>
                <Button variant={'contained'}
                        onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>Test 400
                    errors</Button>
                <Button variant={'contained'}
                        onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>Test 401
                    errors</Button>
                <Button variant={'contained'}
                        onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>Test 404
                    errors</Button>
                <Button variant={'contained'}
                        onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}>Test 500
                    errors</Button>
                <Button variant={'contained'}
                        onClick={() => getValidationErrors()}>Test
                    Validaion
                    errors</Button>
            </ButtonGroup>
            {validationErrors.length > 0 && <Alert severity={'error'}>
                <List>
                    {validationErrors.map(error => (
                        <ListItem key={error}>
                            <ListItemText>
                                {error}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Alert>}
        </Container>
    );
};

export default AboutPage;
