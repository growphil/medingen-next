import React, { useState, useEffect } from "react";
import "./style.css";
import Navigation from "../Dashboard/Navigation";
import Header from "../Dashboard/Header";
import {
  addToCart,
  getOrders,
  getUser,
} from "../../api/Api";
import Swal from "sweetalert2";
import Link from "next/link";
import { useLegacyRouting } from "@/lib/router-compat";
import { 
  FiUser, 
  FiPackage, 
  FiMapPin, 
  FiFileText, 
  FiDatabase, 
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiRotateCw
} from "react-icons/fi";
import { handleSignOut } from "../../api/Api";

const getNumericPrice = (priceStr) => {
  if (priceStr === null || priceStr === undefined) return "0.00";
  if (typeof priceStr === "number") return priceStr.toFixed(2);
  
  const strPrice = String(priceStr);
  const match = strPrice.match(/([\d,.]+)\s*$/);
  if (match && match[1]) {
    return parseFloat(match[1].replace(/,/g, "")).toFixed(2);
  }
  return "0.00";
};

const getValidQuantity = (quantity) => {
  const qty = parseInt(quantity, 10);
  return !isNaN(qty) ? qty : 0;
};

const deduplicateProducts = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  const productMap = {};
  products.forEach((product) => {
    const productId = product.id || product.product_id;
    if (!productId) return;
    
    if (productMap[productId]) {
      productMap[productId].quantity =
        getValidQuantity(productMap[productId].quantity) +
        getValidQuantity(product.quantity);
    } else {
      productMap[productId] = { ...product };
    }
  });

  return Object.values(productMap);
};

const nameToSlug = (name) => {
  return name
    ? name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    : "";
};

export const Orders = () => {
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const { navigate } = useLegacyRouting();

  useEffect(() => {
    const user = getUser();
    if (!user.customer_id) {
      navigate("/login");
      return;
    }
    fetchOrdersList();
  }, [page, searchInput, navigate]);

  const fetchOrdersList = async () => {
    setLoading(true);
    try {
      const response = await getOrders(page, searchInput, 10);
      setOrders(response.orders || []);
      setTotalPages(response.total_pages || 1);
      setTotalOrders(response.total_count || (response.total_pages * 10) || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch orders",
      });
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOrdersList();
  };

  const handleTrack = (cart_id, order) => {
    navigate(`/track-order/${order.cart_id}`, { state: { orders: order } });
  };

  const handleViewDetails = (cart_id, order) => {
    navigate(`/order-details/${order.cart_id}`, { state: { orders: order } });
  };

  const handleReorder = async (products) => {
    const deduplicatedProducts = deduplicateProducts(products);
    const validProducts = deduplicatedProducts.filter(
      (product) => getValidQuantity(product.quantity) > 0
    );

    if (validProducts.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Valid Items",
        text: "No valid items found to reorder",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    const failedItems = [];
    for (const p of validProducts) {
      try {
        await addToCart(p.id || p.product_id, getValidQuantity(p.quantity));
      } catch (error) {
        failedItems.push(p.name);
      }
    }

    if (failedItems.length > 0) {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Re-order",
        text: "Some items could not be added to cart. Add those manually",
        confirmButtonText: "OK",
      }).then(() => navigate("/cart"));
    } else {
      navigate("/cart");
    }
  };

  const handleLogout = () => {
    handleSignOut();
    navigate("/login");
  };

  return (
    <>
      <div className="orders-view" style={{ fontFamily: "Outfit, sans-serif" }}>
        <Header title="My Orders" maxWidth={1200} showMobileBack={true} />
        
        <div className="profile-main-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <nav className="sidebar-nav">
              <Link href="/profile" className="sidebar-item">
                <FiUser className="sidebar-icon" />
                Personal Information
              </Link>
              <Link href="/orders" className="sidebar-item active">
                <FiPackage className="sidebar-icon" />
                My Orders
              </Link>
              <Link href="/savedaddress" className="sidebar-item">
                <FiMapPin className="sidebar-icon" />
                Manage Addresses
              </Link>
              <button className="sidebar-item">
                <FiDatabase className="sidebar-icon" />
                Health Coins
              </button>
              
              <button className="sidebar-item logout" onClick={handleLogout}>
                <FiLogOut className="sidebar-icon" />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="profile-content-area">
            <div className="orders-page-header">
              <div className="title-section">
                <h1 className="page-main-title">My Orders</h1>
                <p className="page-subtitle">Manage and track your recent pharmacy orders</p>
              </div>
              <div className="header-actions">
                <button 
                  className={`header-refresh-btn ${loading ? 'spinning' : ''}`}
                  onClick={handleRefresh}
                  title="Refresh Orders"
                >
                  <FiRotateCw />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="orders-list">
                {[...Array(3)].map((_, i) => (
                  <SkeletonOrderCard key={i} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="no-orders" style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <p style={{ fontSize: "16px", fontWeight: 600 }}>No orders to display.</p>
                <p style={{ fontSize: "14px", marginTop: "4px" }}>Place your first order and enjoy the offers and cashback!</p>
              </div>
            ) : (
              <>
                <div className="orders-list">
                  {orders.map((order, idx) => (
                    <OrderCard
                      key={order.cart_id || order.id || idx}
                      order={order}
                      handleReorder={handleReorder}
                      handleTrack={handleTrack}
                      handleViewDetails={handleViewDetails} 
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="orders-pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
                    <div className="orders-pagination-info" style={{ fontSize: "14px", color: "#6b7280" }}>
                      Showing {Math.min((page - 1) * 10 + 1, totalOrders)} to {Math.min(page * 10, totalOrders)} of {totalOrders} orders
                    </div>
                    <div className="orders-pagination-controls" style={{ display: "flex", gap: "8px" }}>
                      <button 
                        className={`orders-page-arrow ${page <= 1 ? 'disabled' : ''}`}
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", background: page <= 1 ? "#f3f4f6" : "#fff" }}
                      >
                        <FiChevronLeft />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button 
                          key={i}
                          className={`orders-page-num ${page === i + 1 ? 'active' : ''}`}
                          onClick={() => setPage(i + 1)}
                          style={{
                            padding: "8px 14px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor: page === i + 1 ? "#000" : "#fff",
                            color: page === i + 1 ? "#fff" : "#000",
                            fontWeight: "bold"
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button 
                        className={`orders-page-arrow ${page >= totalPages ? 'disabled' : ''}`}
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", background: page >= totalPages ? "#f3f4f6" : "#fff" }}
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        <div className="margin-72"></div>
      </div>
      <Navigation />
    </>
  );
};

const SkeletonOrderCard = () => (
  <div className="order-card-v2 skeleton" style={{ animation: "pulse 1.5s infinite", background: "#f9fafb", border: "1px solid #f3f4f6", height: "180px", borderRadius: "12px", marginBottom: "16px" }}></div>
);

const OrderCard = ({ order, handleReorder, handleTrack, handleViewDetails }) => {
  const { navigate } = useLegacyRouting();
  const rawProducts = order.products || [];
  const products = deduplicateProducts(rawProducts);
  const orderSummary = order.orderSummary || {};
  const cart_id = order.cart_id || order.id;

  const rawDate = order.payment_done_date || order.created_date || order.cart_created_date || order.updated_date;
  const date = new Date(rawDate);
  const formattedDate = isNaN(date.getTime()) 
    ? "N/A" 
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

  const rawStatus = (order.cartStatus || order.status || "pending_confirm").toLowerCase();
  
  const getStatusInfo = (status) => {
    switch(status) {
      case 'delivered': return { label: 'Delivered', class: 'delivered' };
      case 'dispatched': 
      case 'out_for_delivery': return { label: 'In Transit', class: 'in-transit' };
      case 'cancelled': return { label: 'Cancelled', class: 'cancelled' };
      default: return { label: 'Processing', class: 'pending' };
    }
  };

  const statusInfo = getStatusInfo(rawStatus);

  const paymentMode = (order.payment_mode || "").toLowerCase();
  
  const getFinalActionType = () => {
    if (rawStatus === "confirm") {
      return paymentMode === "online" ? "Pay Now" : "Call Now";
    }
    switch (rawStatus) {
      case 'dispatched':
      case 'out_for_delivery':
        return 'Track Order';
      case 'delivered':
      case 'cancelled':
      case 'return':
        return 'Reorder';
      default:
        return 'Call Now';
    }
  };

  const finalActionType = getFinalActionType();

  const handlePay = () => {
    const cartValue = parseFloat(getNumericPrice(orderSummary.total_selling_price));
    const shippingCharge = parseFloat(order.shipping_charge || 0);
    const totalPayable = cartValue + shippingCharge;
    navigate("/order-payment", {
      state: {
        total_amount: totalPayable.toFixed(2),
        mig_coins: orderSummary.migCoins || 0,
        cart_id: cart_id,
      },
    });
  };

  const getProductImage = (p) => {
    if (p.image && (typeof p.image === 'string') && (p.image.startsWith('http') || p.image.startsWith('data:'))) return p.image;
    const imagePath = p.image || 'medicine-details.png';
    return `https://d1dh0rr5xj2p49.cloudfront.net/products/${imagePath}`;
  };

  const getProductsSummaryText = () => {
    if (products.length === 0) return "";
    const names = products.map(p => p.name);
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]}, ${names[1]}`;
    return `${names[0]}, ${names[1]}, and ${names.length - 2} other item${names.length - 2 > 1 ? 's' : ''}`;
  };

  const totalPrice = Number(
    orderSummary.totalAmount || 
    (parseFloat(getNumericPrice(orderSummary.total_selling_price)) + 
     parseFloat(orderSummary.shipping_charge || order.shipping_charge || 0) + 
     parseFloat(orderSummary.cod_charge || 0))
  ).toFixed(2);

  return (
    <div className="order-card-v2">
      <div className="order-card-header-v2">
        <div className="header-info-column">
          <span className="info-label">ORDER ID</span>
          <span className="info-value">#{cart_id}</span>
          <span className="mobile-order-date">{formattedDate.split(',')[0]}</span>
        </div>
        <div className="header-info-column desktop-only-col">
          <span className="info-label">DATE</span>
          <span className="info-value">{formattedDate}</span>
        </div>
        <div className="header-info-column desktop-only-col">
          <span className="info-label">TOTAL PRICE</span>
          <span className="info-value price">₹{totalPrice}</span>
        </div>
        <div className="header-status-column">
          <span className={`status-badge-v2 ${statusInfo.class}`}>
            <span className="status-dot"></span>
            {statusInfo.label}
          </span>
          <span className="mobile-order-price">₹{totalPrice}</span>
        </div>
      </div>

      <div className="order-card-body-v2">
        <div className="order-content-left">
          <div className="product-thumbnails">
            {products.slice(0, 3).map((p, i) => (
              <div 
                className="thumbnail-box" 
                key={i}
                onClick={(e) => {
                  if (p.product_name_url) {
                    e.stopPropagation();
                    navigate(`/product/${p.product_name_url}`);
                  }
                }}
                style={{ cursor: p.product_name_url ? 'pointer' : 'default' }}
              >
                <img 
                  src={getProductImage(p)} 
                  alt={p.name} 
                  onError={(e) => { e.target.src = "/medicine-details.png"; }}
                />
              </div>
            ))}
            {products.length > 3 && (
              <div className="thumbnail-more-badge">
                +{products.length - 3}
              </div>
            )}
          </div>
          <div className="order-products-summary">
            {getProductsSummaryText()}
          </div>
        </div>

        <div className="order-content-right">
          <button 
            className="view-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(cart_id, order);
            }}
          >
            View Details
          </button>
          <button
            className={`order-action-btn-v2 ${finalActionType === 'Track Order' || finalActionType === 'Reorder' ? 'primary' : 'secondary'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (finalActionType === "Reorder") handleReorder(products);
              else if (finalActionType === "Call Now") window.open("tel:+917090123709");
              else if (finalActionType === "Pay Now") handlePay();
              else handleTrack(cart_id, order);
            }}
          >
            {finalActionType}
          </button>
        </div>
      </div>
    </div>
  );
};

