import React, { useState } from 'react';

const Dropdown = ({ options, onSelect, attributeName }: { options: any, onSelect: any, attributeName: string }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (event : any) => {
    setSelectedOption(event.target.value);
    onSelect(event, attributeName);
  };

  const labelTitle = attributeName.charAt(0).toUpperCase() + attributeName.slice(1).replace('_', ' ');

  return (
    <div>
      <label htmlFor="sportTypeDropdown">{labelTitle}:</label>
      <select id="sportTypeDropdown" value={selectedOption} onChange={(e) => handleSelect(e)}>
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