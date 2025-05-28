import React, { useState } from "react";
import "../styles/images.css"; 

const EventImageCard = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="image-wrapper">
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || "event image"}
          className="image"
            loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="no-image-placeholder">No image available</div>
      )}
    </div>
  );
};

export default EventImageCard;
