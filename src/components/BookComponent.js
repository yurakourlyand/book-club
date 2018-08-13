import React, {PureComponent} from 'react';
import {Button, ButtonGroup} from 'reactstrap';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class BookComponent extends PureComponent {

    titleFilter = (title) => {
        let englishFilter = title.replace(/[^A-Za-z-\s]/g, '');
        let lowerCase = englishFilter.toLowerCase();
        let firstUpperCase = lowerCase.replace(/^\w/g, c => c.toUpperCase());
        return firstUpperCase.replace(/\s\w/g, c => c.toUpperCase());
    };


    render() {
        let image = null;
        if(this.props.book.volumeInfo.imageLinks){
            image = this.props.book.volumeInfo.imageLinks.smallThumbnail
                ? this.props.book.volumeInfo.imageLinks.smallThumbnail
                : '/default_book.jpg';
        } else {
            image = '/default_book.jpg';
        }
        return (
            <div className="card m-2 " style={{width: '18rem'}}>
                <img className="card-img-top" style={{height: '250px', width: '100%'}}
                     src={image}
                     alt="Card  cap"
                />

                <div className="card-body" style={{height: '150px', backgroundColor: 'lightgray'}}>
                    <h5 className="card-title">
                        {this.titleFilter(this.props.book.volumeInfo.title)}
                    </h5>
                    <p className="card-text">
                        {this.props.book.volumeInfo.authors.join(', ')}
                    </p>
                    <p className="card-text">
                        {moment(this.props.book.volumeInfo.publishedDate).format('DD MMM YYYY')}
                    </p>
                </div>

                <ButtonGroup className={'d-flex'}>
                    <Button
                        className={'flex-fill'}
                        onClick={e => this.props.editBook({...this.props.book})}
                    >
                        <FontAwesomeIcon icon="edit"/>{' '}
                        Edit
                    </Button>
                    <Button

                        color="warning"
                        onClick={e => this.props.deleteBook(this.props.book)}
                    >
                        <FontAwesomeIcon icon="trash"/>{' '}
                    </Button>

                </ButtonGroup>

            </div>
        );
    }
}

