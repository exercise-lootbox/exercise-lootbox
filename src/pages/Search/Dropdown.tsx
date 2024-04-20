import React, { useEffect, useState } from 'react';

const Dropdown = ({ options, onSelect, attributeName, currentState }: { options: any, onSelect: any, attributeName: string, currentState: string }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (event : any) => {
    setSelectedOption(event.target.value);
    onSelect(event, attributeName);
  };

  const labelTitle = attributeName.charAt(0).toUpperCase() + attributeName.slice(1).replace('_', ' ');

  return (
    <div className="form-input">
      <label htmlFor="sportTypeDropdown">{labelTitle}</label>
      <br />
      <select className="width-220" id="sportTypeDropdown" value={selectedOption} onChange={(e) => handleSelect(e)}>
        <option value="">Select an option</option>
        {options.map((option: any, index: any) => {
          const displayName = option.replace(/\B(?=[A-Z])/g, ' ');
          return (
            <option key={index} value={option}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;