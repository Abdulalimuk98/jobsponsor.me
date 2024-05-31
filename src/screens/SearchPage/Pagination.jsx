import React from 'react';

const Pagination = ({ sponsorsPerPage, totalSponsors, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalSponsors / sponsorsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // console.log(`Current page: ${currentPage}`);

  return (
    <nav>
      <ul className='pagination'>
        <li className='page-item'>
          <a
            href='#'
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) {
                paginate(currentPage - 1);
              }
            }}
            className='page-link'
          >
            &laquo;
          </a>
        </li>
        {pageNumbers.map(number => {
          // Show a range of 5 pages centered around the current page and the last page
          if ((number >= currentPage - 2 && number <= currentPage + 2) || number === totalPages) {
            return (
              <li key={number} className='page-item'>
                <a
                  onClick={(event) => {
                    event.preventDefault();
                    paginate(number);
                  }}
                  href='#'
                  className={`page-link ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </a>
              </li>
            );
          }

          // Show an ellipsis instead of page numbers outside the range and before the last page
          if (number === currentPage - 3 || number === currentPage + 3) {
            return <li key={number} className='page-item'><span className='page-link'>...</span></li>;
          }

          return null;
        })}
        <li className='page-item'>
          <a
            href='#'
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages) {
                paginate(currentPage + 1);
              }
            }}
            className='page-link'
          >
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;