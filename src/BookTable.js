import React from 'react';
import BookForm from "./BookForm";

/**
 * Books Table Class
 * Displays user with a list of all books in the library
 * Handles checkin/checkout state, launches edit form, and deletes line items from library
 */
class BookTable extends React.Component {
    constructor(props) {
        super(props);

        //API Constants
        this.apiUrl = process.env.REACT_APP_BOOK_API_ROOT
        this.apiKey = process.env.REACT_APP_BOOK_API_KEY;

        //figure out loading state, default to loading
        let isLoading=props.isLoading;
        if(typeof(props.isLoading)==="undefined"){
            isLoading=true;
        }
        
        //state
        this.state = {
            books: props.books,
            hasBooks: props.books && props.books.length > 0 ? true : false,
            isLoading: isLoading,
            checkoutLoading:[]
        }
        
        //Edit book ref
        this.editBookForm=React.createRef();

        
        this.setCheckedOutState = this.setCheckedOutState.bind(this);
        

    }

    async componentDidMount() {
        let response = await fetch(this.apiUrl, {
            method: "GET",
            headers: {
                'X-Api-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });                
        response=await response.json();
        const books=response.books || [];
        books.sort((a,b)=>{
            if (a.isbn < b.isbn) return -1;
            if (a.isbn > b.isbn) return 1;
            return 0;
        });
        this.setState({ 
            isLoading: false, 
            books: books, 
            hasBooks:books.length > 0 ? true : false               
        });    
        console.log(this.state.books);
           
    }

    editBook = (isbn) =>{
        const singleBook=this.state.books.filter((item)=>{
            return isbn===item.isbn;
        })
        singleBook[0].disableISBN=true;        
        this.editBookForm.current.populateBookForm(singleBook[0]);
    }

    async deleteBook(isbn){
        this.setState({
            isLoading:true
        });

        //Call server and delete
        await fetch(this.apiUrl, {
            method: "DELETE",
            headers: {
                'X-Api-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                isbn:isbn
            })
        });

        //remove from books array by isbn key
        let books = this.state.books.filter((item)=>{
            return item.isbn!==isbn
        })
        
        this.setState({
            isLoading:false,
            books:books,
            hasBooks:books.length > 0 ? true : false                
        })               
          
    }

    async setCheckedOutState(book,checkedOutState){
        this.state.checkoutLoading[book.isbn]=true;
        this.setState({
            checkoutLoading:this.state.checkoutLoading
        })
        await fetch(this.apiUrl, {
            method: "POST",
            body: JSON.stringify({
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                description: book.description,
                checkedOut:checkedOutState
            }),
            headers: {
                'X-Api-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });

        //would be better to find this by a key instead of a loop
        //but with a small data set its fast enough
        //alternatively, we could do a Fetch to get a full updated list of books        
        let books=this.state.books;        
        for(let i=0;i<books.length;i++){
            if(books[i].isbn===book.isbn){
                books[i].checkedOut=checkedOutState
                break;
            }
        }
        this.state.checkoutLoading[book.isbn]=false;        
        this.setState({
            books:books,
            checkoutLoading:this.state.checkoutLoading
        })        
        
    }

    render() {
        if (this.state.isLoading === true) {
            return <div className="bookTableLoading"><img alt="loading" src="images/loader.gif" /></div>
        }
        else if (!this.state.hasBooks) {
            return (<p>No books available</p>)
        }
        else {
            return (
                <>
                    <BookForm ref={this.editBookForm} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Description</th>
                                <th width="200px">Check Out</th>
                                <th width="155px">Edit</th>
                                <th width="35px">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.books.map((book) => {
                                let checkedOutHTML=<img src="/images/loader.gif" alt="loading" style={{width:"10px", height:"10px", textAlign:"center"}} />
                                if(this.state.checkoutLoading[book.isbn]){
                                    checkedOutHTML = <img src="/images/loader.gif" alt="loading" style={{width:"10px", height:"10px"}} />
                                }
                                else if(book.checkedOut==="true"){
                                    checkedOutHTML = <>Book checked out.<button type="button" onClick={()=>this.setCheckedOutState(book,"false")}>Check In</button></>
                                }
                                else{
                                    checkedOutHTML = <button className="button" onClick={()=>this.setCheckedOutState(book,"true")}>Check Out</button>
                                }
                                return (
                                    <tr key={book.isbn}>
                                        <td>{book.isbn}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.description}</td>
                                        <td>
                                            {checkedOutHTML}
                                        </td>
                                        <td align="left"><img alt="edit" src="images/icon_edit.png" alt="Edit this book" onClick={() => this.editBook(book.isbn)} /></td>
                                        <td align="center"><img alt="edit" src="images/icon_delete.png" alt="Delete this book" onClick={() => this.deleteBook(book.isbn)} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            )
        }
    }


}

export default BookTable