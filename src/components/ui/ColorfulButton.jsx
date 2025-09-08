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

  return (
    <button 
      className={`colorful-button ${variant} ${className}`} 
      style={buttonStyle}
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
