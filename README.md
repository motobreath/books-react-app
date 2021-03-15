# Magnifico Book Store
A practice in React, AWS API Gateway, and Dynamo DB to manage a book store to add/edit/remove books and mark them as checked in or out.

## Front End: React
The storefront of our bookstore is written in React. Using the following classes:

 - App.js: The homepage and main application code
 - BookForm.js: The form used to add or edit a book
 - BookTable.js: The layout table of our book store. Also includes methods to check in/out books, delete books from the library, and edit a book

#### Notes on Front End React

 - Could use better error handling
 - Consistency: Better use of async, consistent components throughout
 - Better decoupled methods: Separation of concerns for update methods. BooksTable class seems a bit large to me.
 - Update books without a page refresh: Currently adding a book will refresh the page. Would be faster to update book table class
 - Had CORS issues running in Chrome locally, had to install a plugin: https://www.moesif.com/?int_source=corsextension
 - Testing: Simple tests included to make sure the components render. Would be better to unit test each method.
 
 ## API Gateway
REST endpoints managed in AWS Gateway. Using a service link in AWS, maps requests/responses dealing with Dynamo DB calls. REST API details:
 
 - Verbs:
   - POST: Create or edit a book. Pass an ISBN to edit a book.
   - GET: Get a list of all books
   - DELETE: Delete a single book by ISBN number

#### API Access
Endpoints and keys are locaed in .env file not committed to GIT, reach out to chris@chrismitchellonline.com for access


#### Sample Payloads
**Create/Update including check-in/check-out**
```
{
    "isbn": "nnn", 
    "author": "Chris",
    "title": "A great Book",
    "description": "Yet another great book by author chris",
    "checkedIn": true
}
```

**Delete:**
```
{
    "isbn":"nnn"
}
```

## Dynamo DB
Used to store books and checked in/checked out state with ISBN being the primary key.

#### Notes on DDB

  - In this simple case of checking books in and out there is only a flag in the table to marked status. A more in depth solution would have a separate table to manage that state.
  - The flag *checkedIn* field is a string for simplicity, this should have been a BOOL value.





