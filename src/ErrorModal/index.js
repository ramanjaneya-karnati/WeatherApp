import React, {Component, Fragment} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


export default class ErrorModal extends Component {
    state = {
        maxWidth: 'sm',
        isOpen: false
    };


    componentWillReceiveProps(props) {
        if (props.openModal != this.state.isOpen) {
            this.setState({isOpen: props.openModal});
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    fullWidth={true}
                    maxWidth={this.state.maxWidth}
                    open={this.state.isOpen}
                    onClose={() => {
                        this.setState({isOpen: false});
                        this.props.closeHandler();
                    }}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <p>Something went wrong. Please try again :(</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({isOpen: false});
                            this.props.closeHandler();
                        }} color="primary">
                            Close
                        </Button>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}
