"use client";

export function ColorfulButton({ children, className = "", variant = "secondary", width = "240px", ...props }) {
  const buttonStyle = {
    width: width,
    minWidth: width
  };
  
  const wrapperStyle = {
    width: width,
    minWidth: width
  };

  function handlePointer(e) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // normalized center -0.5..0.5
    const nx = x / rect.width - 0.5;
    const ny = y / rect.height - 0.5;
    target.style.setProperty('--pointer-x', `${nx.toFixed(3)}`);
    target.style.setProperty('--pointer-y', `${ny.toFixed(3)}`);
    target.style.setProperty('--pointer-px', `${(x / rect.width) * 100}%`);
    target.style.setProperty('--pointer-py', `${(y / rect.height) * 100}%`);
  }

  function resetPointer(e){
    const target = e.currentTarget;
    target.style.setProperty('--pointer-x', '0');
    target.style.setProperty('--pointer-y', '0');
    target.style.setProperty('--pointer-px', '50%');
    target.style.setProperty('--pointer-py', '50%');
  }

  return (
    <button
      className={`colorful-button ${variant} ${className}`}
      style={buttonStyle}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      {...props}
    >
      <div className="wrapper" style={wrapperStyle}>
        <span className="flex items-center justify-center h-full">
          {children}
        </span>
        <div className="circle circle-12"></div>
        <div className="circle circle-11"></div>
        <div className="circle circle-10"></div>
        <div className="circle circle-9"></div>
        <div className="circle circle-8"></div>
        <div className="circle circle-7"></div>
        <div className="circle circle-6"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-1"></div>
      </div>
    </button>
  );
}
