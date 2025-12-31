import React from 'react';

const FontCard = ({ fontName, transformedText, isFavorite, safety, onCopy, onToggleFav }) => {
    return (
        <div className={`font-card ${isFavorite ? 'favorite' : ''}`}>
            <div className="card-header">
                <span className="card-label">{fontName}</span>
                <div className="card-meta">
                    <span
                        className={`safety-dot ${safety?.safetyLevel || 'safe'}`}
                        title={safety?.reasons?.join(', ') || 'Safe'}
                    ></span>
                    <button className="fav-btn" onClick={(e) => { e.stopPropagation(); onToggleFav(fontName); }}>
                        <i className={`fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                </div>
            </div>
            <div className="card-text" onClick={() => onCopy(transformedText, fontName)}>
                {transformedText || "Fancy Text"}
            </div>
            {safety?.platformWarning && (
                <div className="platform-warn">{safety.platformWarning}</div>
            )}
            <div className="ripple"></div>
        </div>
    );
};

export default FontCard;
