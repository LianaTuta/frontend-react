import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import "./fields.css";

const EditableTextField = ({
  fieldKey,
  value,
  isManager = false,
  onConfirm,
  onDiscard,
  as = "input",
  maxLength = 100,
  className = "",
  displayClassName = "",
  editButtonBelow = false, 
  error = null, 
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value || "");

  useEffect(() => {
    if (!editing) {
      setTemp(value || "");
    }
  }, [value, editing]);

  const handleConfirm = () => {
    const trimmed = temp.trim();
    console.log(fieldKey, trimmed);
    onConfirm(fieldKey, trimmed);
    setEditing(false);
  };

  const handleDiscard = () => {
    setTemp(value || "");
    onDiscard?.(fieldKey);
    setEditing(false);
  };

  return (
    <div className={`editable-row ${className}`}>
      {editing ? (
        <>
          {as === "textarea" ? (
            <textarea
              className="input-field"
              rows={3}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              maxLength={maxLength}
            />
          ) : (
            <input
              className="input-field"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              maxLength={maxLength}
            />
          )}
          <div className="edit-controls">
            <button className="edit-button-inline small" onClick={handleConfirm}>
              <FaCheck style={{ marginRight: "4px" }} /> Confirm
            </button>
            <button className="edit-button-inline small" onClick={handleDiscard}>
              <FaTimes style={{ marginRight: "4px" }} /> Discard
            </button>
          </div>
        </>
      ) : (
        <div className={`text-edit-pair ${editButtonBelow ? "vertical" : "inline"}`}>
        <span className={`inline-text ${displayClassName}`}>{value}</span>
        {isManager && (
          <div className="edit-button-row">
            <button
              className="edit-button-inline small"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <FaEdit /> Edit
            </button>
          </div>
        )}
        
      </div>     
      )}
       {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default EditableTextField;
