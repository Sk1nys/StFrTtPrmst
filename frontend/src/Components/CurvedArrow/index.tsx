import React from 'react'
import ReactCurvedText from "react-curved-text";
interface CurvedArrowProps{
    children?:string;
}
const CurvedArrow: React.FC<CurvedArrowProps> = ({children}) => {
  return (
    <>
    
    <svg width="250" height="81" viewBox="0 0 536 81" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="customCurve" d="M488.676 27.4122L488.228 26.5178L488.228 26.5178L488.676 27.4122ZM535.449 4.81623C535.623 4.29228 535.34 3.72596 534.816 3.55132L526.278 0.705266C525.754 0.530618 525.188 0.813778 525.013 1.33772C524.839 1.86166 525.122 2.42798 525.646 2.60263L533.235 5.13246L530.705 12.7219C530.531 13.2459 530.814 13.8122 531.338 13.9868C531.862 14.1615 532.428 13.8783 532.603 13.3544L535.449 4.81623ZM22.7338 23.669L22.31 24.5748L22.7338 23.669ZM205.774 74.9799L205.666 75.9739L205.666 75.9739L205.774 74.9799ZM216.624 76.1671L216.733 75.173L216.733 75.173L216.624 76.1671ZM332.246 75.0755L332.374 76.0673L332.374 76.0673L332.246 75.0755ZM489.123 28.3066L534.947 5.39443L534.053 3.60557L488.228 26.5178L489.123 28.3066ZM0.576205 14.4058L22.31 24.5748L23.1575 22.7632L1.4238 12.5942L0.576205 14.4058ZM205.666 75.9739L216.515 77.1611L216.733 75.173L205.883 73.9858L205.666 75.9739ZM22.31 24.5748C80.1924 51.6574 142.14 69.0228 205.666 75.9739L205.883 73.9858C142.576 67.0585 80.8411 49.7528 23.1575 22.7632L22.31 24.5748ZM332.374 76.0673C386.933 69.0526 439.922 52.9069 489.123 28.3066L488.228 26.5178C439.228 51.0177 386.455 67.0976 332.119 74.0837L332.374 76.0673ZM332.119 74.0837C293.835 79.0059 255.103 79.3715 216.733 75.173L216.515 77.1611C255.042 81.3768 293.933 81.0097 332.374 76.0673L332.119 74.0837Z" fill="black"/>
</svg>
<ReactCurvedText
      text={children||""}
      width={300}
      height={300}
      cx={150} // center x position
      cy={15} // center y position
      rx={130} // radius of the curve
      ry={50} // radius of the curve
      startOffset={50} // starting position on the curve
      textProps={{ style: { fontSize: 20 } }} // additional props for text styling
      textPathProps={{ fill: 'black' }} // additional props for text path
      tspanProps={{ dy: 10 }} // additional props for individual tspan elements
        />
    </>
  )
}

export default CurvedArrow