import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { 
  getDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  Row,
  Col,

} from "shards-react";
ChartJS.register(ArcElement, Tooltip, Legend);

const Report = () => {
  const { id } = useParams();
  const { eid } = useParams();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      setLoading("pending");
      await getAnswers();
      setLoading(null);
    };
    fetch();
    getAnswers();
  }, []);

  const getAnswers = async () => {
    const docRef = doc(db, "answers", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      
      
      let obj = docSnap.data();
      // 
      
      // if (typeof obj["answersData"][eid][id] !=="undefined"){
      setAnswers(obj["answersData"][eid][id]);
      // }
      // else {
      // setAnswers({})
      // }
    } else {
      // doc.data() will be undefined in this case
      
    }
  };

  // useEffect(() => {
  //   // 
  // }, [answers]);

  const data = {
    labels: ["a", "b", "c", "d"],
    datasets: [
      {
        label: "# of Votes",
        data: typeof answers !== "undefined" && [
          answers[1],
          answers[2],
          answers[3],
          answers[4],
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 3,
      },
    ],
  };

  return (
    <>
      <h3
        style={{
          fontWeight: "400",
          paddingTop: "20px",
          paddingBottom: "20px",
          // paddingLeft: "20px",
        }}
      >
        Report
      </h3>

      {loading === "pending" ? (
        <span></span>
      ) : typeof answers === "undefined" ? (
        <div className="container">
          <div class="alert alert-danger" role="alert">
            Users did not answered this question yet...
          </div>
        </div>
      ) : (
        <div className="container d-flex justify-content-center">
          <Col md={6}>
            <div
              style={{
                border: "3px solid gray",
                marginBottom: "70px",
                borderRadius: "20px",
                paddingLeft: "100px",
                paddingRight: "100px",
                paddingBottom: "30px",
              }}
              className=""
            >
              <div style={{ padding: "20px" }}>
                <Doughnut data={data} />
              </div>
            </div>
          </Col>
        </div>
      )}
    </>
  );
};

export default Report;
