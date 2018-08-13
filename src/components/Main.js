import * as React from 'react';
import {connect} from 'react-redux';
import {
    fetchBooks,
    deleteBook,
    startEditingBook,
    stopEditingBook
} from "../state/reducers/BookReducer";
import BookComponent from './BookComponent'
import * as _ from 'lodash'
import YesOrNoAlert from "./YesOrNoAlert";
import EditBookModal from "./EditBookModal";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
} from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const mapStateToProps = (state) => {

    let {books, theEditingBook, isEditingBook, isLoadingResults} = state.BookReducer;
    return {
        books,
        theEditingBook,
        isEditingBook,
        isLoadingResults
    }
};

const Actions = {
    fetchBooks,
    deleteBook,
    startEditingBook,
    stopEditingBook,
};


class Main extends React.Component {

    state = {
        deleteAlertBook: null,
        modal: true,
    };

    componentWillMount() {
        this.props.fetchBooks();
    }

    openConfirmationModal = (book) => {
        this.setState({deleteAlertBook: book});
    };

    openEditBookModal = (book) => {
        this.props.startEditingBook(book);
    };

    closeEditBookModal = () => {
        this.props.stopEditingBook();
    };

    render() {
        if(this.props.isLoadingResults){
            return <div className={'container mt-5'}>
                <h4>Loading...</h4>
            </div>
        }

        return (
            <div>
                <Navbar color='dark' dark>
                    <NavbarBrand href="/">Book Project</NavbarBrand>
                    <Nav>
                        <NavItem>
                            <Button
                                className="fas fa-stroopwafel"
                                color='info'
                                onClick={() => this.openEditBookModal({
                                    id: '',
                                    volumeInfo: {
                                        title: '',
                                        publishedDate: new Date(),
                                        authors: [],
                                    }
                                })}
                            >
                                <FontAwesomeIcon icon="plus"/>{' '}
                                Add New Book
                            </Button>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container-fluid">

                    <div className="d-flex align-content-between flex-wrap ">
                        {
                            _.map(this.props.books, book => {
                                return <BookComponent
                                    key={book.id}
                                    deleteBook={book => this.openConfirmationModal(book)}
                                    editBook={book => this.openEditBookModal(book)}
                                    book={book}
                                />
                            })
                        }
                    </div>

                    { this.state.deleteAlertBook &&
                    <YesOrNoAlert
                        isOpen={this.state.deleteAlertBook !== null}
                        title="Are you sure?"
                        body={"Are you sure that you want to delete book " + this.state.deleteAlertBook.volumeInfo.title}
                        handleConfirm={()=>{
                            this.props.deleteBook(this.state.deleteAlertBook.id);
                            this.setState({deleteAlertBook: null});
                        }}
                        handleCancel={(()=>{
                            this.setState({deleteAlertBook: null});
                        })}
                    />
                    }

                    { this.props.isEditingBook &&
                    <EditBookModal
                        isOpen={this.props.isEditingBook }
                        title={this.props.theEditingBook.id ? 'Edit Book' : 'Create Book'}
                        handleSave={()=>{

                        }}
                        handleCancel={this.closeEditBookModal}
                    />
                    }


                </div>
                <hr/>
            </div>
        );
    }
}
export default connect(mapStateToProps, Actions)(Main);
