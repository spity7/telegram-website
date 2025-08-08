import { LightgalleryProvider } from "react-lightgallery";
import PortfolioFilter from "../../../components/portfolio/portfolio-filter";
import PortfolioItem from "../../../components/portfolio/portfolio-item";
import PortfolioData from "../../../data/portfolio.json";
import useMasonry from "../../../hooks/use-masonry";
import { slugify } from "../../../utils";
import React, { useState } from "react";
import axios from "axios";

const PortfolioContainer = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/search`,
                { params: { query } }
            );
            setResults(data);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Isotope Categories list JS

    const { categories } = useMasonry(
        PortfolioData,
        ".portfolio-list",
        ".masonry-grid",
        ".messonry-button",
        ".messonry-button button"
    );
    return (
        <div className="portfolio-area portfolio-default-area">
            <div className="container-fluid">
                <h2>Search Telegram Posts</h2>
                <input
                    type="text"
                    placeholder="Search keyword (e.g., pool)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && query.trim()) {
                            search();
                        }
                    }}
                    style={{ padding: "0.5rem", width: "300px" }}
                />
                <button
                    onClick={search}
                    disabled={!query.trim()}
                    style={{ marginLeft: "1rem", padding: "0.5rem" }}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
                {/* <div className="row">
                    <div className="col-12">
                        <div className="messonry-button text-center mb-50">
                            <PortfolioFilter categories={categories} />
                        </div>
                    </div>
                </div> */}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 portfolio-list mb-n30">
                    {/* <div className="col resizer"></div> */}
                    {loading && <p>Loading...</p>}
                    {!loading && (
                        <LightgalleryProvider>
                            {results &&
                                results.map((post, index) => (
                                    <div
                                        key={index}
                                        // eslint-disable-next-line react/no-unknown-property
                                        group={`any`}
                                        className={`col masonry-grid mb-30`}
                                    >
                                        <PortfolioItem post={post} />
                                    </div>
                                ))}
                        </LightgalleryProvider>
                    )}
                </div>

                {/* <div className="row">
                    <div className="col-lg-12 text-center mt-60">
                        <button className="btn-portfolio">loading</button>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default PortfolioContainer;
