import React from "react";
import styled from "styled-components";
import Button from "./Button";
import TextInput from "./TextInput";
import { FaFileImage } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 70vw;
  height: 70vh;
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const StyledLabel = styled.label`
  padding: 0.5em;
  margin: 0.5em;
  border-radius: 5px;
  background-color: #bbb9ac;
  cursor: pointer;
  &:hover {
    background-color: burlywood;
  }
  & > * {
    margin-right: 0.5em;
  }
`;

const ComposeModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptioins] = useState([]);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSelectChange = (event) => {
    const selectedValue = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptioins(selectedValue);
  };
  const currentID = localStorage.getItem('pk')
  useEffect(() => {

    setInputs((values) => ({ ...values, categories: selectedOptions }));
    setInputs((values) => ({
      ...values,
      visibility: "friends only",
    }));
    setInputs((values) => ({...values, owner: currentID }))
  }, [selectedOptions]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // setInputs((values) => ({ ...values, [name]: value }));
    setInputs((values) => {
      if (name === "post_image") {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result;
            console.log(base64);
            setInputs(() => ({
              ...values,
              [name]: base64,
            }));
          };
          reader.readAsDataURL(file);
        }
      } else {
        setInputs(() => ({
          ...values,
          [name]: value,
        }));
      }
    });
  };
  const handleSelectAndChange = (event) => {
    handleSelectChange(event);
    handleChange(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");
    console.log("submit");
    console.log(inputs);
    if (authToken) {
      axios
        .post("http://127.0.0.1:8000/api/posts/", inputs, {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': "application/json"
          },
        })
        .then((res) => {
          console.log(res);
          toast.success("Post Sent!");
          onClose();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to sent");
        });
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <h2>Send Post to A Friend</h2>
        <TextInput
          onChange={handleChange}
          name="message_to"
          placeholder={"To: "}
        ></TextInput>
        <TextInput
          onChange={handleChange}
          name="title"
          placeholder={"Title: "}
        ></TextInput>
        <TextInput
          onChange={handleChange}
          name="description"
          placeholder={"Description: "}
        ></TextInput>
        <TextInput
          name="content"
          box={true}
          onChange={handleChange}
          placeholder={"Enter your Post"}
        ></TextInput>
        <input
          onChange={handleChange}
          name="post_image"
          type="file"
          id="images"
          accept="image/*"
          active={false}
          style={{ display: "none" }}
        />
        <StyledLabel htmlFor="images">
          <FaFileImage />
          Select Image
        </StyledLabel>
        <label htmlFor="multiSelect">Select the Category</label>
        <select
          name="categories"
          id="multiSelect"
          multiple
          value={selectedOptions}
          onChange={handleSelectAndChange}
        >
          {categories.map((option) => (
            <option key={option.id} value={option.category}>
              {option.category}
            </option>
          ))}
        </select>
        <div>
          <Button onClick={(e) => handleSubmit(e)} variant={"success"}>
            Send
          </Button>
          <Button variant={"warning"} onClick={onClose}>
            Cancle
          </Button>
        </div>
      </ModalContainer>
    </Overlay>
  );
};

export default ComposeModal;
