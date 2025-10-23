import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopPanel.css';

function ShopPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [marlyImage, setMarlyImage] = useState(null);

  // Recuperar role desde storage (igual que en GestionVentas)
  const userRole = parseInt(
    sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || "0",
    10
  );

  // Cargar imagen desde localStorage si existe
  useEffect(() => {
    const savedImage = localStorage.getItem("marlyImage");
    if (savedImage) {
      setMarlyImage(savedImage);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Cambiar imagen SOLO si userRole === 1
  const handleImageChange = (event) => {
    if (userRole !== 1) return;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setMarlyImage(imageData);
        localStorage.setItem("marlyImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Disparar input SOLO si es admin
  const triggerImageInput = () => {
    if (userRole === 1) {
      const input = document.getElementById("marly-image-upload");
      if (input) input.click();
    }
  };

  if (!isOpen) return null;

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Mapeo de categorías a rutas
  const categoryRoutes = {
    Bracelets: "/brazaletes",
    Earrings: "/aretes",
    Necklaces: "/collares",
    Rings: "/anillos",
    Hoops: "/aros",
  };

  return (
    <div
      ref={panelRef}
      className={`shop-panel-dropdown ${isOpen ? "active" : ""}`}
    >
      <div className="panel-grid">
        {/* Columna Category */}
        <div className="panel-column category-col">
          <div className="column-header category-header">CATEGORY</div>
          <div className="column-items">
            {["Bracelets", "Earrings", "Necklaces", "Rings", "Hoops"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(categoryRoutes[item])}
                  className="panel-btn category-btn"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        {/* Columna Material */}
        <div className="panel-column material-col">
          <div className="column-header material-header">MATERIAL</div>
          <div className="column-items">
            {[
              "Polymer Clay",
              "Copper Wire",
              "Resin",
              "Textile",
              "Invisible Thread",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  handleNavigation(
                    `/shop/material/${item.toLowerCase().replace(" ", "-")}`
                  )
                }
                className="panel-btn material-btn"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Columna Featured */}
        <div className="panel-column featured-col">
          <div className="column-header featured-header">FEATURED</div>
          <div className="column-items">
            <button
              onClick={() => handleNavigation("/shop/best-sellers")}
              className="panel-btn featured-btn"
            >
              BEST SELLERS
            </button>

            <button
              onClick={() => handleNavigation("/shop/marly-favorites")}
              className="panel-btn featured-btn"
            >
              MARLY'S FAVORITES
            </button>
          </div>
        </div>

        {/* Columna Imagen Marly */}
        <div className="panel-column marly-col">
          <div className="marly-image-section">
            {userRole === 1 ? (
              <div
                className="marly-image-container clickable"
                onClick={triggerImageInput}
                title="Click para cambiar imagen (Admin)"
              >
                <div
                  className="marly-image-square"
                  style={{
                    backgroundImage: marlyImage
                      ? `url(${marlyImage})`
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!marlyImage && <span className="marly-letter">M</span>}
                  <div className="image-overlay">
                    <span className="camera-icon">📷 Cambiar</span>
                  </div>
                </div>
                <input
                  type="file"
                  id="marly-image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              </div>
            ) : (
              <div className="marly-image-container" title="Imagen de Marly">
                <div
                  className="marly-image-square"
                  style={{
                    backgroundImage: marlyImage
                      ? `url(${marlyImage})`
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!marlyImage && <span className="marly-letter">M</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPanel;