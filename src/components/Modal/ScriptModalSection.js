import React, { useState } from 'react';

import '../../styles/Modal/ScriptModalSection.css'

function ScriptModalSection({ value, onChange }) {
  const [code, setCode] = useState(value);

  const handleChange = event => {
    setCode(event.target.value);
    onChange(event.target.value);
  };

  return (
    <textarea
      value={code}
      onChange={handleChange}
      className="code-editor"
    />
  );
};

export default ScriptModalSection;