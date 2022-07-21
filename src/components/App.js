import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { theme } from 'theme';

import Searchbar from './Searchbar';
import Modal from './common/Modal';
import ImageGallery from './ImageGallery';
import Button from './common/Button';
import Loader from './common/Loader';

import { pixabayAPI } from '../services';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [ images, setImages ] = useState([]);
  const [ imageModal, setImageModal ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoadMore, setIsLoadMore] = useState(false);
  const [ isLastPage, setIsLastPage] = useState(false);
  const [ query, setQuery ] = useState('');
  const [ page, setPage ] = useState(1);


  const normalizeData = (hits) => hits.map(({ id, webformatURL, largeImageURL }) => ({ id, webformatURL, largeImageURL}));
  const loadMore = async () => {
    const lastPage = page >= pixabayAPI.totalPages;

    setPage(lastPage ? page : page + 1);
    setIsLastPage(lastPage);
  };
  const closeModal = (e) => {
    const isEscapePressed = e.code === 'Escape';
    const isOverlayClicked = e.target === e.currentTarget;

    if (isEscapePressed || isOverlayClicked) {
      setImageModal('')
    }
  };

  useEffect(() => {
    const findImageByQuery = () => {
      setIsLoading(true);
      pixabayAPI.getImage(query, page).then(({ hits }) => {
          if (!hits.length) {
            toast.error(`There are no images by ${query} query`)
            return setImages([]);
          }

          setImages(normalizeData(hits));
        })
          .catch(console.log)
          .finally(() => setIsLoading(false));
      }

      if (query === '') {
        toast.warn('Please, type something to start searching...');
        return;
      }

      if (query !== '' && page === 1) {
          findImageByQuery();
      }

      return;
  }, [query, page]);

  useEffect(() => {
    const nextPage = () => {
      setIsLoadMore(true);
      pixabayAPI.getImage(query, page)
        .then(({ hits }) => setImages(images => [ ...images, ...normalizeData(hits)]))
        .catch(console.log)
        .finally(() => setIsLoadMore(false));
    }

    if (page > 1) nextPage();

  }, [page, query]);

    const shouldRenderGallery = !isLoading && images.length;

    return (
      <ThemeProvider theme={theme}>
          <Searchbar
            onSubmit={(query) => {
              setQuery(query);
              setPage(1);
            }}
          />
          <main>
            {
              isLoading ? <Loader type='dual-rings'/> : null
            }
            {
              shouldRenderGallery
                ? <>
                    <ImageGallery
                      openModal={(imageURL) => setImageModal(imageURL)}
                      imageList={images}
                    />
                    <Button
                        onClick={loadMore}
                        showLoader={isLoadMore}
                        disabled={isLastPage}
                    >
                        Load more
                    </Button>
                  </>
                : null
            }
          </main>
          {
            imageModal
              ? <Modal
                  imageURL={imageModal}
                  closeModal={closeModal}
                />
              : null
          }
          <ToastContainer/>
      </ThemeProvider>
    );
};
