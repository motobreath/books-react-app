import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

/**
 * BookForm Class
 * Adds or updates a book in the library from a Modal window.
 */
class BookForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isbn: props.isbn ? props.isbn : "",
            title: props.title ? props.title : "",
            author: props.author ? props.author : "",
            description: props.description ? props.description : "",
            disableISBN: props.disableISBN ? props.disableISBN : false,
            show:props.show ? props.show : false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showBookForm = this.showBookForm.bind(this);
        this.hideBookForm = this.hideBookForm.bind(this);

        this.apiUrl = process.env.REACT_APP_BOOK_API_ROOT
        this.apiKey = process.env.REACT_APP_BOOK_API_KEY;
    }
    
    showBookForm(event){
        this.setState({show:true})        
    }
    hideBookForm(event){
        this.setState({show:false}) 
    }

    populateBookForm(book){
        console.log(book);
        this.setState({
            isbn:book.isbn,
            title:book.title,
            author:book.author,
            description:book.description,
            disableISBN:book.disableISBN,
            show:true
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }
    

    async handleSubmit(event) {
        if (this.state.isbn === "" || this.state.title === "" || this.state.author === "") {
            alert("ISBN, Title, and Author are all required to create a new book.")
            return;
        }

        fetch(this.apiUrl, {
            method: "POST",
            body: JSON.stringify({
                isbn: this.state.isbn,
                title: this.state.title,
                author: this.state.author,
                description: this.state.description
            }),
            headers: {
                'X-Api-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        //To make this a true "SPA" this should update state of Books object
        //easier to just refresh page that will call all books on load
        }).then(res=>{
            window.location.href = "/"
        })

        event.preventDefault();
    }

    render() {
        return (
        <>            
            <Modal show={this.state.show}>
                <form onSubmit={this.handleSubmit} className="bookForm">
                    <Modal.Header closeButton onClick={this.hideBookForm}>
                    <Modal.Title>Book Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                
                        <label>ISBN:</label>
                        <input type="text" name="isbn" className="form-control" value={this.state.isbn} onChange={this.handleChange} disabled={this.state.disableISBN}/>
                        <label>Title:</label>
                        <input type="text" name="title" className="form-control" value={this.state.title} onChange={this.handleChange} />
                        <label>Author:</label>
                        <input type="text" name="author" className="form-control" value={this.state.author} onChange={this.handleChange} />
                        <label>Description:</label>
                        <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleChange} />
                        <br />                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.hideBookForm}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            
        </>
        );
    }
}

export default BookForm