import React, { useState, useEffect } from "react";
import "./style.css";
import Navigation from "../Dashboard/Navigation";
import Link from "next/link";
import { useLegacyRouting } from "@/lib/router-compat";
import { getOffers } from "../../api/Api";
import Header from "../Dashboard/Header";

export const Offers = () => {
  const { navigate } = useLegacyRouting();

  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers(page);
  }, [page]);

  const fetchOffers = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOffers(pageNumber);
      if (data && Array.isArray(data.offers)) {
        if (pageNumber === 1) {
          setOffers(data.offers);
        } else {
          setOffers((prevOffers) => [...prevOffers, ...data.offers]);
        }
        setHasNext(!!data.has_next);
      } else {
        setHasNext(false);
      }
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setError("Failed to load offers. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOffer = (offer) => {
    navigate("/view-offer", { state: { offer } });
  };

  const handleViewMore = () => {
    if (hasNext && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const formatOfferDescription = (desc) => {
    if (!desc) return "";

    const lines = desc
      .replace(/\\r/g, "")
      .split(/\n|\r|\r\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const filteredLines = lines.filter(
      (line) => !line.toLowerCase().includes("terms & conditions")
    );

    const numberedList = filteredLines
      .map((line) => `<li>${line.replace(/^\d+\.\s*/, "")}</li>`)
      .join("");

    return `<ol class="offer-terms-list">${numberedList}</ol>`;
  };

  return (
    <>
      <div className="offers-page" style={{ fontFamily: "Outfit, sans-serif" }}>
        <Header id="offers-page-header" title={"Offers"} />

        <div className="offers-content-wrapper">
          <div className="offers-tabs-container">
            <button className="tab-button active">Offers</button>
            <Link href="/rewards" className="tab-button">
              Rewards
            </Link>
          </div>

          <div className="offers-grid-container">
            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={() => fetchOffers(page)}>Retry</button>
              </div>
            )}

            {!error && offers.length === 0 && !loading && (
              <div className="empty-state">
                <p className="title">No active offers available</p>
                <p className="subtitle">Check back later for new promotional campaigns.</p>
              </div>
            )}

            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <img
                  className="offer-image"
                  alt="Offer"
                  src={
                    "https://d1dh0rr5xj2p49.cloudfront.net/banner/" +
                    offer.image
                  }
                  onError={(e) => { e.target.src = "/medicine-details.png"; }}
                />
                <div className="offer-card-content">
                  <h3 className="offer-title">{offer.title}</h3>
                  <div className="offer-terms-section">
                    <span className="terms-label">Terms & Conditions:</span>
                    <div
                      className="terms-content"
                      dangerouslySetInnerHTML={{
                        __html: formatOfferDescription(offer.description),
                      }}
                    ></div>
                  </div>
                  <button className="view-offer-btn" onClick={() => handleViewOffer(offer)}>
                    {offer.linkText || "View Offer Now"}
                    <span className="arrow-icon"> &rarr;</span>
                  </button>
                </div>
              </div>
            ))}

            {loading && (
              <div className="skeleton-container">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="skeleton-card"></div>
                ))}
              </div>
            )}
          </div>

          {!loading && !error && offers.length > 0 && (
            <div className="pagination-container">
              {hasNext ? (
                <button onClick={handleViewMore} className="view-more-button">
                  View More
                </button>
              ) : (
                <p className="no-more-offers-text">
                  No more offers available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </>
  );
};

export default Offers;
