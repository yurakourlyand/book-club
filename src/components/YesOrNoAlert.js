import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class YesOrNoAlert extends React.PureComponent {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} className={this.props.className}>
                <ModalHeader toggle={this.props.handleCancel}>{this.props.title}</ModalHeader>
                <ModalBody>
                    {this.props.body}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.props.handleConfirm}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.props.handleCancel}>No</Button>
                </ModalFooter>
            </Modal>
        );
    }

}
