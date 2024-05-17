import React, { useEffect, useState } from "react";
import "../../css/Count.css";
import CountDisplay from "./CountDisplay";
import { SERVER } from "../../../context/config";

function Count() {
  const [count, setCount] = useState(0);
  const [visitors, setVisitors] = useState(0);

  React.useLayoutEffect(()=>{
    const fetchCounts = async () => {
      try {
        const [validQuestionPapersResponse, visitorsResponse] = await Promise.all([
          fetch(`${SERVER}/api/count/valid-question-papers`),
          fetch(`${SERVER}/api/count/visitors`)
        ]);
      
        const validQuestionPapersData = await validQuestionPapersResponse.json();
        const visitorsData = await visitorsResponse.json();
      
        setCount(validQuestionPapersData.count);
        setVisitors(visitorsData.count);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };
  
    fetchCounts();
  },[])

  return (
    <div>
      <section id="counts" className="counts">
        <div className="container">
          <div className="row">
            <CountDisplay
              icon="eye"
              number={visitors}
              title="Number of visitors"
            />
            <CountDisplay icon="file-text" number={count} title="Papers" />
            <CountDisplay
              icon="headset"
              number="24/7"
              title="Hours Of Support"
            />
            <CountDisplay icon="user" number={2} title="Developers" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Count;
