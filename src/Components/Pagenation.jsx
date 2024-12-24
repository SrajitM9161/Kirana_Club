import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Select } from '@shopify/polaris';

const PaginationControls = ({ rowsPerPage, onRowsPerPageChange, currentPage, totalPages, onNext, onPrevious }) => {
  const rowsOptions = [10, 25, 50, 100].map((value) => ({
    label: String(value),
    value: String(value),
  }));

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <Select
        label="Rows per page"
        options={rowsOptions}
        value={String(rowsPerPage)}
        onChange={(value) => onRowsPerPageChange(Number(value))}
      />
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={onPrevious}
        hasNext={currentPage < totalPages}
        onNext={onNext}
      />
    </div>
  );
};

PaginationControls.propTypes = {
  rowsPerPage: PropTypes.number.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default React.memo(PaginationControls);
