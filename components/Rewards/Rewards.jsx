import React, { useEffect, useState } from "react";
import "./style.css";
import { RewardsViewMIG } from "../RewardsViewMig/RewardsViewMIG";
import Navigation from "../Dashboard/Navigation";
import Swal from "sweetalert2";
import {
  getOffers,
  getRewardsTransactions,
  getRewardsSummary,
  getUser,
} from "../../api/Api"; // Import the API functions
import Link from "next/link";
import { useLegacyRouting } from "@/lib/router-compat";
import Header from "../Dashboard/Header";

export const Rewards = () => {
  const { navigate } = useLegacyRouting();
  const [migCoins, setMigCoins] = useState({
    available: 0,
    overall: 0,
    expiring: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [offerData, setOfferData] = useState({
    id: 1,
    title: "Biggest Ever Sale is happening on National Pharmacist Day",
    description:
      "Buy all your medicine at 15% flat discount and also free of all delivery charges",
    image: "rectangle-264.png",
    linkText: "View Offer Now",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchOffers = async (page) => {
    try {
      const data = await getOffers(page);
      if (data.offers.length !== 0) {
        const offersData = data.offers[0] || [];
        setOfferData(offersData);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch offers. Please try again.", "error");
    }
  };

  const fetchMIGCoins = async () => {
    try {
      const data = await getRewardsSummary();

      // Compute available, overall, and expiring values based on the summary data
      const available = parseFloat(data.available);
      const overall = parseFloat(data.overall);
      const expiring = parseFloat(data.expiring);

      setMigCoins({
        available: available.toFixed(2),
        overall: overall.toFixed(2),
        expiring: expiring.toFixed(2),
      });
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to fetch MIG coin data. Please try again.",
        "error"
      );
    }
  };

  const fetchTransactions = async (page) => {
    try {
      const data = await getRewardsTransactions(page);
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        ...data.transactions,
      ]);
      setHasMore(data.has_next);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to fetch transactions. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    const user = getUser();
    if (!user.customer_id) {
      navigate("/login");
      return;
    }
    fetchOffers(1);
    fetchMIGCoins();
    fetchTransactions(page);
  }, [page]);

  const handleViewOffer = (offer) => {
    navigate("/view-offer", { state: { offer } });
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleClose = () => {
    setSelectedTransaction(null);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="rewards-page" style={{ fontFamily: "Outfit, sans-serif" }}>
        <div className="reward-content">
          <Header title="Rewards" />

          <div className="rewards-container">
            <div className="offers-tabs-container">
              <Link href="/offers" className="tab-button">
                Offers
              </Link>
              <button className="tab-button active">Rewards</button>
            </div>

            <div className="info-alert">
              <span className="info-icon">ℹ</span>
              <p className="info-text">
                Find out how much you can save through MIG Cashback Coins
              </p>
            </div>

            <h3 className="rewards-section-title">My MIG Cashback Coins</h3>

            <div className="rewards-stats-card">
              <div className="stat-column">
                <div className="stat-icon-wrapper available">
                  <img className="stat-icon" alt="Available" src="/image-20.png" />
                </div>
                <div className="stat-label">Available</div>
                <div className="stat-value">{migCoins.available} Coins</div>
              </div>
              <div className="stat-column">
                <div className="stat-icon-wrapper overall">
                  <img className="stat-icon" alt="Overall" src="/image-20.png" />
                </div>
                <div className="stat-label">Overall</div>
                <div className="stat-value">{migCoins.overall} Coins</div>
              </div>
              <div className="stat-column">
                <div className="stat-icon-wrapper expiring">
                  <img className="stat-icon" alt="Expiring" src="/image-20.png" />
                </div>
                <div className="stat-label">Expiring</div>
                <div className="stat-value expiring">{migCoins.expiring} Coins</div>
              </div>
            </div>

            <div className="promotional-banner">
              <div className="offer-card">
                <img
                  className="offer-image"
                  alt="Offer"
                  src={
                    "https://d1dh0rr5xj2p49.cloudfront.net/banner/" +
                    offerData.image
                  }
                  onError={(e) => { e.target.src = "/medicine-details.png"; }}
                />
                <div className="offer-card-content">
                  <h3 className="offer-title">{offerData.title}</h3>
                  <div className="offer-terms-section">
                    <div
                      className="terms-content"
                      dangerouslySetInnerHTML={{
                        __html: offerData.description.split("</p>")[0] + "</p>",
                      }}
                    ></div>
                  </div>
                  <button className="view-offer-btn" onClick={() => handleViewOffer(offerData)}>
                    {offerData.linkText || "View Offer Now"}
                    <span className="arrow-icon"> &rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="recent-transaction">
              {transactions.length !== 0 && (
                <h3 className="rewards-section-title left-aligned">
                  Recent MIG Cashback Coin Transactions
                </h3>
              )}
              <div className="transaction-list">
                {transactions.map((transaction, index) => {
                  const isCredit = transaction.reward.toString().includes("+") || parseFloat(transaction.reward) > 0;
                  return (
                    <div
                      key={index}
                      className="transaction-item"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className={`transaction-icon-badge ${isCredit ? "credit" : "debit"}`}>
                        {isCredit ? "﹢" : "﹣"}
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-description">
                          {transaction.description}
                        </div>
                        <div className="transaction-date-time">
                          <span>{transaction.date}</span>
                          <span className="bullet-dot">&bull;</span>
                          <span>{transaction.time}</span>
                        </div>
                      </div>
                      <div className={`transaction-reward ${isCredit ? "credit" : "debit"}`}>
                        {transaction.reward} Coins
                      </div>
                    </div>
                  );
                })}
                {hasMore && (
                  <button className="view-more-button" onClick={handleLoadMore}>
                    View More
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="margin-72"></div>
        </div>

        {selectedTransaction && (
          <RewardsViewMIG
            transaction={selectedTransaction}
            onClose={handleClose}
          />
        )}

        <Navigation />
      </div>
    </>
  );
};

export default Rewards;
