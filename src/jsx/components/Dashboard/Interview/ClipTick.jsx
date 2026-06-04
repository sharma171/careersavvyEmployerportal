import React from 'react';

const ClipTick = ({ x, y, payload }) => {
    const label = payload.value || "";
    const maxLineLength = 12; // Adjust to desired max characters per line
  
    // Split the label into words
    const words = label.split(" ");
    const lines = [];
    let currentLine = [];
  
    // Group words until the line would exceed maxLineLength
    words.forEach((word) => {
      const testLine = [...currentLine, word].join(" ");
      if (testLine.length > maxLineLength) {
        // push the current line to lines and start a new one
        lines.push(currentLine.join(" "));
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });
    // Add the last line
    if (currentLine.length) {
      lines.push(currentLine.join(" "));
    }
  
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill="#666"
        style={{ fontSize: "10px" }}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={x}
            dy={index === 0 ? "0.9em" : "0.9em"} 
            // You can adjust dy to control spacing between lines
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };

export default ClipTick;
