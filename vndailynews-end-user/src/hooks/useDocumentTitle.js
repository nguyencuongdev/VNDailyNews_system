// src/hooks/useDocumentTitle.js

import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default useDocumentTitle;
