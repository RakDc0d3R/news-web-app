import { NewsItemType } from "./NewsBoard";

const NewsItem = (props: { news: NewsItemType }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 h-100">
      <div className="card">
        <div className="image-container">
          {props?.news?.urlToImage ? (
            <img
              src={props?.news?.urlToImage}
              className="card-img-top"
              alt="loading..."
            />
          ) : (
            <div className="card-img d-flex justify-content-center align-items-center bg-secondary text-white">
              No Image Available
            </div>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate" title={props?.news?.title}>
            {props?.news?.title}
          </h5>
          <p
            className="card-text text-truncate"
          >
            {props?.news?.description ? props?.news?.description : 'NA'}
          </p>
          <p
            className="font-weight-light text-capitalize"
            title={props?.news?.category}
          >
            Category: {props?.news?.category ? props?.news?.category : 'NA'}
            <br />
            Published date: {props?.news?.publishedDate}
          </p>
          <a href={props?.news?.url} className="btn btn-primary">
            Read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
