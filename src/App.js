
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,  faTrash, faEdit, faSave} from '@fortawesome/free-solid-svg-icons'


import React, { Component } from 'react';
import Main from './components/Main';


import { Provider } from 'react-redux';
import Store from './state/index.js';
import './App.css';

library.add(faPlus, faTrash, faEdit, faSave);

class App extends Component {
  render() {
    return (

        <div>
            <Provider store={Store}>
                <Main/>
            </Provider>
            </div>
    );
  }
}

export default App;
