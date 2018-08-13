import React from 'react'
import {connect} from 'react-redux';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter ,
    FormGroup,
    Form,
    Label,
    Input,
    FormText,
    FormFeedback,
    InputGroupAddon,
    InputGroupButton,
    InputGroup,
    Alert
} from 'reactstrap';
import * as _ from 'lodash';
import {updateEditingBook, saveBook} from "../state/reducers/BookReducer";
import moment from 'moment';

const mapStateToProps = (state) => {

    let {theEditingBook, books} = state.BookReducer;
    return {
        theEditingBook,
        books,
    }
};

const Actions = {
    updateEditingBook,
    saveBook,
};


export class EditBookModal extends React.Component {

    componentWillMount(){
        console.log('EditBookModal props: ', this.props);
    }


    state = {
        newAuthor: "",
        noAuthorError: false,
    };

    validateNewAuthor = (author) => {
        return !!(author &&
            author.length > 3 &&
            author.length < 50 &&
            new RegExp(/^[a-z-\s]+$/i).test(author));
    };

    validateAndAddAuthor = (author) => {
        if(this.validateNewAuthor(author)){
            let book    = this.props.theEditingBook;
            let newAuthors = [
                ...book.volumeInfo.authors,
                author
            ];
            this.updateBookInfo('authors', newAuthors);
            this.setState({newAuthor: ""});
        }

    };

    deleteAuthor = (index) => {
        let book    = this.props.theEditingBook;
        book.volumeInfo.authors.splice(index, 1);
        this.props.updateEditingBook(book);
    };

    renderAuthors = () => {
        let authors = this.props.theEditingBook.volumeInfo.authors;
        let book    = this.props.theEditingBook;
        return (
            <div>
                <h5>Authors</h5>
                <hr/>
                {
                    _.map(authors, (author, index) => {
                        return (
                            <div key={author + index} className="d-flex flex-row">
                                <div className="p-2">
                                    {author}
                                </div>
                                <div className="p-2">
                                    <Button
                                        color="danger"
                                        onClick={() => this.deleteAuthor(index)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                }

                <InputGroup>
                    <Input
                        onChange={(e)=> {
                            this.setState({
                                newAuthor: e.target.value,
                            });
                        }}
                        invalid={!this.validateNewAuthor(this.state.newAuthor)}
                        value={this.state.newAuthor}
                        placeholder={"Add an Author"}
                    />
                    <FormFeedback>
                        Author name should consist only of english letters, non-consecutive spaces and between 4 to 50 characters
                    </FormFeedback>


                </InputGroup>
                <Button
                    className="mt-2 mb-2"
                    color={"success"}
                    onClick={() => this.validateAndAddAuthor(this.state.newAuthor)}
                >
                    Add Author
                </Button>

                {this.state.noAuthorError &&
                <Alert color={'danger'}>
                    Please add one or more authors to continue
                </Alert>
                }
            </div>
        );
    };



    updateBookInfo = (prop, value) => {
        this.props.updateEditingBook({
            ...this.props.theEditingBook,
            volumeInfo: {
                ...this.props.theEditingBook.volumeInfo,
                [prop]: value,
            }
        });
    };

    handleSaveBook = () => {

        this.setState({noAuthorError: false});
        let volume = this.props.theEditingBook.volumeInfo;
        if(this.validateTitle(volume.title)=== '' &&
           this.validateDate(volume.publishedDate) === '' &&
           this.validateAuthors())
        {
            this.props.saveBook(this.props.theEditingBook);
            this.setState({noAuthorError: false});
        }
        else {
            console.log('Form is not filled right.');
        }
    };

    validateTitle = (title) => {
        if(!title){
            console.log('No title');
            return 'Please enter a title for the book.';
        }

        let bookExists = false;
        _.forEach(this.props.books, (book) => {
            console.log('compare book ', book.id, ' with ', this.props.theEditingBook.id);
            if(book.id.trim === this.props.theEditingBook.id.trim) return true;
            else if(book.volumeInfo.title === title){
                bookExists = true;
                return false;
            }
        });


        console.log('book exists:', bookExists);
        if(bookExists){
            console.log('book exists');
            return 'Book with title "' + title + '" is taken.';
        }

        return '';
    };

    validateDate = (date) => {
        if(!date) {
            console.log('Please specify publish date.');
            return 'Please specify publish date.';
        }
        if(date > new Date()){
            console.log('Please specify a date in the past.');
            return 'Please specify a date in the past.';
        }
        return '';
    };

    validateAuthors = () => {
        let authors = this.props.theEditingBook.volumeInfo.authors;
        if(authors && authors.length > 0) return true;
        else {
            this.setState({noAuthorError: true});
            return false;
        }
    };

    render() {
        let book = this.props.theEditingBook;
        return (
            <Modal backdrop={true} isOpen={this.props.isOpen} className={this.props.className}>
                <ModalHeader toggle={this.props.handleCancel}>{this.props.title}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                invalid={!!this.validateTitle(book.volumeInfo.title)}
                                value={book.volumeInfo.title}
                                onChange={(e) => {
                                    this.updateBookInfo('title', e.target.value);
                                }}
                            />
                            <FormFeedback>{this.validateTitle(book.volumeInfo.title)}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Date Published</Label>
                            <Input
                                type='date'
                                value={moment(book.volumeInfo.publishedDate).format('YYYY-MM-DD')}
                                invalid={!!this.validateDate(book.volumeInfo.publishedDate)}
                                onChange={(e) => {
                                    let date = moment(e.target.value).toDate();
                                    this.updateBookInfo('publishedDate', date);
                                }}
                            />
                            <FormFeedback>{this.validateDate(book.volumeInfo.publishedDate)}</FormFeedback>
                        </FormGroup>
                        {this.renderAuthors()}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSaveBook}>Save</Button>
                    <Button color="secondary" onClick={this.props.handleCancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, Actions)(EditBookModal);
