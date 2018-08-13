import axios from 'axios';
import * as _ from 'lodash'
import moment from 'moment';

export const fetchBooks = () => {
    return (dispatch, getState) => {
        dispatch({
            type: "book_reducer/load_books_attempt"
        });
        axios.get('https://www.googleapis.com/books/v1/volumes?q=Harry Potter')
            .then(response => {
                let booksObj = {};
                console.log(response.data);
                _.forEach(response.data.items, book => {
                    booksObj[book.id] = {
                        ...book,
                        volumeInfo: {
                            ...book.volumeInfo,
                            publishedDate: moment(book.volumeInfo.publishedDate).toDate()
                        }
                    };
                });

                dispatch({
                    type: "book_reducer/load_books_success",
                    booksObj
                })
            })
            .catch(response => {
                let error = response.status === 404
                    ? 'books not found'
                    : 'error while loading books';
                dispatch({
                    type: 'book_reducer/load_books_error',
                    error,
                });
            })
    }
};


export const deleteBook = (id) => {
    return {
        type: "book_reducer/delete_book_success",
        id
    };
};

function generateMockId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const startEditingBook = (book) => {


    return {
        type: "book_reducer/start_editing_book",
        book,
    };
};

export const stopEditingBook = () => {
    return {
        type: "book_reducer/stop_editing_book",
    };
};

export const updateEditingBook = (book) => {
    return {
        type: "book_reducer/update_editing_book_form",
        book,
    }
};


export const saveBook = (book) => {
    if(!book.id){
        book.id = generateMockId();
    }
    return {
        type: "book_reducer/save_book",
        book,
    }
};




const InitialState = {
    books: {},
    isLoadingResults: false,
    loadingResultsError: '',

    theEditingBook: null,
    isEditingBook: false,
};


export let BookReducer = (state = InitialState, action) => {
    switch (action.type) {
        //Fetch Book List
        case "book_reducer/load_books_attempt":
            return {
                ...state,
                isLoadingResults: true,
                loadingResultsError: '',
            };
        case "book_reducer/load_books_success":
            return {
                ...state,
                isLoadingResults: false,
                loadingResultsError: '',
                books: action.booksObj,
            };
        case "book_reducer/load_books_error":
            return {
                ...state,
                isLoadingResults: false,
                loadingResultsError: action.error,
            };
        //Delete A Book
        case "book_reducer/delete_book_success":
            let booksCopy =  {...state.books};
            delete booksCopy[action.id];
            return {
                ...state,
                books: booksCopy
            };

        case "book_reducer/start_editing_book":
            return {
                ...state,
                isEditingBook: true,
                theEditingBook: {...action.book},
            };

        case "book_reducer/update_editing_book_form":
            return {
                ...state,
                theEditingBook: {...action.book},
            };

        case "book_reducer/stop_editing_book":

            return {
                ...state,
                isEditingBook: false,
                theEditingBook: null,
            };

        case "book_reducer/save_book":
            return {
                ...state,
                isEditingBook: false,
                theEditingBook: null,
                books: {
                    ...state.books,
                    [action.book.id]: {...action.book},
                }
            };
    }

    return state;
};
