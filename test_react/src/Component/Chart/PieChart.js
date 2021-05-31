import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './PieChart.css';

const PieChart = props => {
    const [offset, setOffset] = useState(0);//tinh %
    const [opacity,setOpacity] = useState(0);//chinh do mo
  
    
    const circleRef = useRef(null);
    const {
        size,
        progress,
        strokeWidth,
    } = props;

    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);
        const opacityOffset = progress/80;
        setOpacity(opacityOffset)

        
        circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';

    }, [setOffset, progress, circumference, offset]);

    return (
        <>
                        <svg
                className="svg"
                width={size}
                height={size}
            >
                <circle
                    className="svg-circle-bg"
                    stroke='#d7d2cc'
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="svg-circle"
                    ref={circleRef}
                    stroke={`rgba(22, 29, 111,${opacity})`}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90, ${center}, ${center})`}
                />
                <text 
                    x={`${center}`} 
                    y={`${center}`} 
                    className="svg-circle-text">
                        {progress}%/100%
                      
                </text>
            </svg>
        </>
    );
}

PieChart.propTypes = {
    size: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    
}

export default PieChart;