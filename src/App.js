import React from 'react';
import BookTable from './BookTable';
import BookForm from './BookForm';

/**
 * App Class
 * Main application of the book store app.
 * Shows table with all books (See BookTable.js)
 * Add a book (See BookForm.js)
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.addBookForm=React.createRef();
  }

  openBookForm=()=>{
    this.addBookForm.current.showBookForm()
  }

  render(){
    return (
      <div className="App">
        <BookForm ref={this.addBookForm}/>
        <button className="btn btn-primary bookForm" onClick={this.openBookForm} >
              Add a New Book
        </button>            
        <h1>Magnifico Book Store - Online</h1>
        <p>The following books are available:</p>      
        <hr />
        <BookTable />      
      </div>
    );
  }
}

export default App;
