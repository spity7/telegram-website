import PropTypes from "prop-types";
import { LightgalleryItem } from "react-lightgallery";
import { Link } from "react-router-dom";

const PortfolioItem = ({ post }) => {
    return (
        <div className="single-portfolio">
            <LightgalleryItem group="any" src={post.media_url}>
                <div className="thumbnail">
                    <div className="overlay">
                        <img src={post.media_url} alt="portfolio" />
                    </div>
                </div>
            </LightgalleryItem>
            <div className="content">
                <h3 className="title">
                    <a
                        href={`https://t.me/${post.channel}/${post.message_id}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {post.channel}
                    </a>
                </h3>
                <p className="desc">{post.text}</p>
            </div>
        </div>
    );
};

PortfolioItem.propTypes = {
    post: PropTypes.object,
};

export default PortfolioItem;
