import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useWindowDimension } from '../hooks/useWindowDimension';

const RepairFileStepper = (props) => {
    const [width] = useWindowDimension();

    const steps = [
        'Statut',
        'Appareil',
        'Domicile',
        'Offre',
        'Infos',
        'Intervention',
        'Règlement'
      ];

    return (
        <Box className='repairFileStepperBox'>
        <Stepper activeStep={props.activeStep} alternativeLabel>
            {steps.map((label) => (
            <Step key={label}>
                <StepLabel>
                    <p className='repairFileStepperLabel'>
                        {width > 600 ? label : ''}
                    </p>
                </StepLabel>
            </Step>
            ))}
        </Stepper>
        </Box>
    );
}

export default RepairFileStepper