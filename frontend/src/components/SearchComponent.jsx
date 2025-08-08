// src/SearchComponent.jsx
import React, { useState } from "react";
import axios from "axios";

function SearchComponent() {
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

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h2>Search Telegram Posts</h2>
            <input
                type="text"
                placeholder="Search keyword (e.g., pool)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                style={{ padding: "0.5rem", width: "300px" }}
            />
            <button
                onClick={search}
                style={{ marginLeft: "1rem", padding: "0.5rem" }}
            >
                {loading ? "Searching..." : "Search"}
            </button>

            <div style={{ marginTop: "2rem" }}>
                {loading && <p>Loading...</p>}
                {!loading &&
                    results.map((post, index) => (
                        <div
                            key={index}
                            style={{
                                borderBottom: "1px solid #ccc",
                                marginBottom: "1rem",
                            }}
                        >
                            <strong>Channel:</strong> {post.channel}
                            <br />
                            <strong>Date:</strong> {post.date}
                            <br />
                            <p>{post.text}</p>
                            {post.media_url && (
                                <a
                                    href={`https://t.me/${post.channel}/${post.message_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={post.media_url}
                                        alt="Post media"
                                        style={{
                                            maxWidth: "300px",
                                            marginTop: "0.5rem",
                                            cursor: "pointer",
                                        }}
                                    />
                                </a>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SearchComponent;
