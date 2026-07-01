import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import Navigation from "../Dashboard/Navigation";
import {
  searchProducts,
  requestProduct,
  getUser,
  getAveragePrice,
} from "../../api/Api"; // Import API functions
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";


export const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const suggestion = state?.product || {};

  const [product, setProduct] = useState({
    ...suggestion,
    name: suggestion.product_name || "Dolo 650 mg",
    manufacturer: suggestion.manufacturer || "Unknown Manufacturer",
    imageSrc: suggestion.first_image_url || "rectangle-252.svg",
    genericName: suggestion.salt_name || "Unknown Salt Name",
    averagePrice: suggestion.avg_product_pricing_old
      ? `${suggestion.avg_product_pricing_old}`
      : "N/A",
    mrp: suggestion.product_pricing_old,
    selling_price: suggestion.product_pricing_new,
    variants: [],
    composition: suggestion.composition || "",
    product_name_url: suggestion.product_name_url || "",
  });

  const handleView = (altproduct = {}) => {
    if (altproduct.product_id) {
      navigate("/product/"+altproduct.product_name_url, { state: { product: altproduct } });
    } else {
      navigate("/product/"+product.product_name_url, { state: { product } });
    }
  };

  const [alternateProducts, setAlternateProducts] = useState([]);
  const [isRequestable, setIsRequestable] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let avgPrice = suggestion.avg_product_pricing_old || 0;
        try {
          const avgRes = await getAveragePrice(suggestion.composition);
          console.log("Average price:", avgRes);
          if (avgRes && typeof avgRes.averagePrice === "number") {
            avgPrice = avgRes.averagePrice;
            setProduct((prevProduct) => ({
              ...prevProduct,
              averagePrice: Math.round(avgRes.averagePrice * 100) / 100,
            }));
          }
        } catch (err) {
          console.error("Error fetching average price:", err);
        }

        try {
          const query = `composition='${suggestion.composition}' AND rc=1`;
          console.log("Query averagePrice context:", avgPrice);
          let result = await searchProducts("", 1, { query });
          // ignore same product.product_id from result
          if (result && result.results) {
            result.results = result.results.filter(
              (p) => p.product_id !== suggestion.product_id
            );

            const updatedProducts = result.results.map((prod) => ({
              originalPrice: prod.product_pricing_old,
              discountedPrice: prod.product_pricing_new,
              discount: avgPrice ? Math.round(
                ((avgPrice - prod.product_pricing_new) /
                  avgPrice) *
                  100
              ) : 0,
              imageUrl: prod.first_image_url,
              name: prod.product_name,
              manufacturer: prod.manufacturer,
              product_id: prod.product_id,
              product_name_url: prod.product_name_url,
            }));
            console.log("Alternate products:", updatedProducts);
            setAlternateProducts(updatedProducts);
          }
        } catch (error) {
          console.error("Error fetching alternate products:", error);
        }
      } catch (e) {
        console.error("Error in search results fetch sequence:", e);
      }
    };

    if (suggestion && suggestion.composition) {
      fetchAllData();
    }

    if (suggestion && !suggestion.product_available && suggestion.product_request) {
      setIsRequestable(suggestion.product_request);
    }
  }, [suggestion]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleRequest = async () => {
    const user = getUser();

    const isLoggedIn = user.isLoggedIn; // Replace with actual login check
    if (isLoggedIn) {
      try {
        await requestProduct(suggestion.product_id, navigate);
        Swal.fire({
          title: "Request Sent",
          text: "Your request has been sent successfully. We will notify you once the product is available.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error requesting product:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Helmet>
        <title>Search Results for "{product.name}" | Medingen</title>
        <meta name="description" content={`Find the best generic equivalents and alternative brands for ${product.name} to save on your prescriptions.`} />
        <link rel="canonical" href={`https://medingen.in/search-results?query=${encodeURIComponent(product.name)}`} />
        <meta property="og:title" content={`Search Results for "${product.name}" | Medingen`} />
        <meta property="og:description" content={`Find the best generic equivalents and alternative brands for ${product.name} to save on your prescriptions.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://medingen.in/search-results?query=${encodeURIComponent(product.name)}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Search Results for "${product.name}" | Medingen`} />
        <meta name="twitter:description" content={`Find the best generic equivalents and alternative brands for ${product.name} to save on your prescriptions.`} />
      </Helmet>
      <div className="search-results">
      <div className="overlap">
        <div className="frame">
          <div className="overlap-group">
            <div className="group"></div>
            <div className="frame-2" onClick={handleBack}>
              <img
                className="line-arrow-chevron"
                alt="Line arrow chevron"
                src="/line-arrow-chevron-left.svg" fetchpriority="high"
              />
              <div className="text-wrapper">Search Results</div>
            </div>
          </div>
        </div>
        <div className="div-wrapper" onClick={handleBack}>
          <div className="frame-wrapper">
            <div className="frame-3">
              <div className="frame-4">{product.name}</div>
            </div>
          </div>
          {/* <img
            className="img-2"
            alt="Fluent mic"
            src="/fluent-mic-20-regular.svg" fetchpriority="high"
          /> */}
        </div>
      </div>
      <div className="search-view">
        <div className="frame-7">
          <div className="frame-8">
            <div className="frame-9">
              <div className="group-6">
                <img
                  className="rectangle-10"
                  alt={product.name}
                  src={
                    "https://d1dh0rr5xj2p49.cloudfront.net/products/" +
                    product.imageSrc
                  }
                />
                <div className="frame-header-14">
                  <div className="text-wrapper-2">{product.name}</div>
                  <div className="text-wrapper-11">
                    {product.manufacturer == "Unknown Manufacturer"
                      ? ""
                      : product.manufacturer}
                  </div>
                </div>
              </div>
              <div className="frame-11">
                <div className="frame-12">
                  <div className="text-wrapper-8">Generic Name</div>
                  <div className="text-wrapper-9">{product.genericName}</div>
                </div>
                {product.rc ? (
                  <div className="frame-13">
                    <div className="text-wrapper-8">Average Price</div>
                    <div className="text-wrapper-10">
                      Rs. {product.averagePrice}
                    </div>
                  </div>
                ): <></>}
              </div>
              <div className="frame-11">
                <div className="frame-12">
                  <div className="text-wrapper-8">MRP</div>
                  <div className="text-wrapper-9">{product.mrp}</div>
                </div>
                {product.rc ? (
                  <div className="frame-13">
                    <div className="text-wrapper-8">Our selling price</div>
                    <div className="text-wrapper-10">
                      Rs. {product.selling_price}
                    </div>
                  </div>
                ): <></>}
              </div>
              <div className="frame-11">
                <div className="add-to-cart">
                  <div className="add-button" onClick={()=>{handleView()}}>
                    View
                  </div>
                </div>
                {product.product_available ? (
                  <></>
                ) : (
                  isRequestable && (
                    <div className="add-to-cart">
                      <div className="add-button" onClick={handleRequest}>
                        Request
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="frame-10 flex-container">
                {product.variants.map((variant, index) => (
                  <div className="overlap-wrapper flex-item" key={index}>
                    <div className="overlap-group-3">
                      <div className="PARACIP-TABLET">{variant.name}</div>
                      <div className="text-wrapper-4">
                        {variant.manufacturer}
                      </div>
                      <div className="text-wrapper-5">{variant.price}</div>
                      <img
                        className="rectangle-9"
                        alt={variant.name}
                        src={
                          "https://d1dh0rr5xj2p49.cloudfront.net/products/" +
                          variant.imageSrc
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {alternateProducts.length > 0 && (
          <div className="alt-text">
            <p className="p">
              Alternative medicine with the same exact composition “
              {product.composition}”
            </p>
          </div>
        )}
        <div className="overlap-3">
          <div className="product-list">
            {alternateProducts.map((altProduct, index) => (
              <div className="product-item" key={index}>
                <img
                  className="product-image"
                  alt={altProduct.name}
                  src={
                    "https://d1dh0rr5xj2p49.cloudfront.net/products/" +
                    altProduct.imageUrl
                  }
                />
                <div className="product-info">
                  <div className="product-name">{altProduct.name}</div>
                  <div className="product-manufacturer">
                    {altProduct.manufacturer}
                  </div>
                  <div className="price-info">
                    {/* <div className="original-price">Rs. {altProduct.originalPrice}</div> */}
                    <div className="discounted-price">
                      Rs. {altProduct.discountedPrice}
                    </div>
                    {altProduct.discount > 0 && (
                      <div className="price-tag">
                        <div className="price-discount">
                          {altProduct.discount}% less price{" "}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="add-to-cart"
                  onClick={() => {
                    handleView(altProduct);
                  }}
                >
                  <div className="add-button">View</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
    </>
  );
};
