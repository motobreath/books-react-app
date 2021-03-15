import { render, screen } from '@testing-library/react';
import App from './App';
import BookTable from "./BookTable";
import BookForm from "./BookForm";

test('render homepage', () => {
  render(<App />);
  const linkElement = screen.getByText(/Book Store/i);
  expect(linkElement).toBeInTheDocument();
});

test('render book table', () => {
  const books=[{
    "isbn":"123"
  }]
  
  render(<BookTable books={books} isLoading={false}/>);
  const linkElement = screen.getByText(/isbn/i);
  expect(linkElement).toBeInTheDocument();
});

test('render book form', () => {
  
  render(<BookForm isbn="123" show={true}/>);
  const linkElement = screen.getByText(/ISBN/i);
  expect(linkElement).toBeInTheDocument();
});
