import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css"
import { formatDate } from "../utils/formatDate";

const EditableDateField = ({
  label,
  value,
  isManager = false,
  onConfirm,
  onDiscard,
  className = ""
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(new Date(value));

  useEffect(() => {
    if (!editing) {
      setTemp(new Date(value));
    }
  }, [value, editing]);

  const handleConfirm = () => {
    onConfirm(temp); // Send selected date to parent
    setEditing(false);
  };

  const handleDiscard = () => {
    setTemp(new Date(value));
    onDiscard?.(); // Optional discard
    setEditing(false);
  };

  return (
    <div className={`editable-date-field ${className}`}>
      {editing ? (
        <>
          <label className="field-label">{label}</label>
          <DatePicker
            selected={temp}
            onChange={(date) => setTemp(date)}
            showTimeSelect
            dateFormat="yyyy/MM/dd HH:mm"
            timeFormat="HH:mm"
            className="input-field"
          />
        
          <div className="edit-controls">
                     <button
                       className="edit-button-inline small"
                       onClick={handleConfirm}
                       title="Confirm"
                     >
                        <FaCheck style={{ marginRight: "4px" }} />  Confirm
                     </button>
                     <button
                       className="edit-button-inline small"
                       onClick={handleDiscard}
                       title="Cancel"
                     >
                       <FaTimes style={{ marginRight: "4px" }} />  Discard
                     </button>
                   </div>
        </>
      ) : (
        <div className="text-edit-pair column-layout">
            <p className="date-text">
        <strong>{formatDate(value)}</strong>
        </p>
        {isManager && (
          <div className="edit-button-row">
            <button className="edit-button-inline small" onClick={() => setEditing(true)}>
              <FaEdit />
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default EditableDateField;
