import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc,orderBy,serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormInput,
  Row,
  Form,
  Container
} from "shards-react";
import {
  NotificationManager,
} from "react-notifications";

const Report2 = () => {
  const [eventData, setEventData] = useState("");

  const AddQuestion=async(e)=>{
    e.preventDefault();

    const questionsRef = collection(db, "questions");
    const q = query(
      questionsRef,
      where("eventID", "==", localStorage.getItem("eventID")),
      orderBy("sequence", "asc")
    );
    const screens = await getDocs(q);
    screens.forEach((doc) => {
      let obj = doc.data();
      // obj = { ...obj, id: doc.id };
      // dataarr.push(obj);
      
       addDoc(collection(db, "questions"), {
        imgURL: obj.imgURL,
        eventID: eventData,
        options: {
          ["1"]: obj.options["1"],
          ["2"]: obj.options["2"],
          ["3"]: obj.options["3"],
          ["4"]: obj.options["4"],
        },
        question: obj.question,
        timer: parseInt(obj.timer),
        sequence: obj.sequence,
        timestamp: serverTimestamp(),
        videoURL: obj.videoURL,
      });

    });
    NotificationManager.success("Questions added for new event");
    setEventData("")
  }

  return (
    <>
    <Container className={"mt-2"}>
      <Form onSubmit={AddQuestion} >
        <FormInput
          className="w-50"
          type="text"
          onChange={(e) => {
            setEventData(e.target.value);
          }}
          value={eventData}
          placeholder="EventId"
        />

        <Button type="submit" className="mt-2">Add</Button>
      </Form>
      </Container>
    </>
  );
};

export default Report2;
