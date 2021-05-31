import { Dialog, DialogContent, DialogTitle, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Close from "../img/cancel.svg";


const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(0.2),
        position: 'absolute',
        top: theme.spacing(5),
        backgroundColor: 'lavender',

    },
    dialogTitle: {
        paddingRight: '5px'
    }
}))

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper}}>
            <DialogTitle className={classes.dialogTitle} >
                <div style={{ display: 'flex', }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1,textAlign: 'center',fontWeight: 'bold',fontSize : '25px',color: 'black',}}>
                        {title}
                     
                    </Typography>
                    <span class="material-icons md-48" onClick={() =>setOpenPopup(false)} > <img
						    	src={Close}
                                
							    alt='logoutIcon'
						    	width='35'
						    	height='35'
							  className='mr-2'
					    	/></span> 
                    
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}