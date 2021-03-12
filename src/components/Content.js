import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Comment,
  Descriptions,
  List,
  Modal,
  Space,
  Input,
  Form,
  Row,
  Col,
} from "antd";
import { InfoCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
const { Meta } = Card;
const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

const Content = ({ movies }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idmovie, setIDmovie] = useState("");
  const [movieDesc, setMovieDesc] = useState(null);
  const [switchModal, setSwitchModal] = useState("description");
  const [data, setData] = useState([]);
  const [state, setState] = useState(firstState);

  useEffect(() => {
    const getData = async () => {
      if (idmovie !== "") {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${idmovie}`
        );
        const dataMovie = await response.json();
        setMovieDesc(dataMovie);
      }
    };

    getData();
  }, [idmovie]);

  const handleOk = () => {
    if (switchModal === "description") {
      setSwitchModal("form");
    } else if (switchModal === "form") {
      setSwitchModal("description");
    }
    setIsModalVisible(false);
  };

  const handleViewModal = (imdbID) => {
    setIDmovie(imdbID);
    setIsModalVisible(true);
    setSwitchModal("description");
  };

  const changeSwitch = () => {
    setSwitchModal("form");
    setIsModalVisible(true);
  };

  const firstState = {
    comments: [],
    submitting: false,
    value: "",
  };

  const handleSubmit = () => {
    if (!state.value) {
      return;
    }

    setState((prevState) => {
      const changeSubmitting = { ...prevState };
      changeSubmitting.submitting = true;
      return changeSubmitting;
    });

    setTimeout(() => {
      setState((prevState) => {
        const changeAll = { ...prevState };
        changeAll.submitting = false;
        changeAll.value = "";
        changeAll.comments = [
          ...changeAll.comments,
          {
            author: "Han Solo",
            avatar:
              "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            content: <p>{state.value}</p>,
            datetime: moment().fromNow(),
          },
        ];

        setMovieDesc((prevState) => {
          return { ...prevState, Comments: changeAll.comments };
        });
        setData(changeAll.comments);
        return changeAll;
      });
    }, 1000);
  };

  const handleChange = (event) => {
    setState((prevState) => {
      const changeValue = { ...prevState };
      changeValue.value = event.target.value;
      return changeValue;
    });
  };

  const { comments, submitting, value } = state;

  return (
    <Row justify="center">
      {movies
        ? movies.map((movie, index) => {
            return (
              <>
                <Col span={8} key={index} align="center">
                  <Card
                    key={index}
                    style={{ width: 300 }}
                    cover={<img alt="example" src={movie.Poster} />}
                  >
                    <Space direction="vertical">
                      <Meta
                        avatar={<Avatar src={movie.Poster} />}
                        title={movie.Title}
                        description={movie.Year}
                      />
                      <Row justify="center">
                        <Space direction="vertical">
                          <Col>
                            <Button
                              onClick={() => handleViewModal(movie.imdbID)}
                            >
                              <InfoCircleOutlined />
                              Ver detalles
                            </Button>
                          </Col>
                          <Col>
                            <Button onClick={changeSwitch}>
                              <PlusCircleOutlined />
                              Añadir comentario
                            </Button>
                          </Col>
                        </Space>
                      </Row>
                    </Space>
                  </Card>
                  <Modal
                    visible={isModalVisible}
                    footer={[
                      <Button key="close" type="primary" onClick={handleOk}>
                        Cerrar
                      </Button>,
                    ]}
                  >
                    {switchModal === "description" ? (
                      <Row>
                        <Col>
                          {movieDesc ? (
                            <Descriptions
                              title={movieDesc.Title}
                              colon={true}
                              column={2}
                              size="middle"
                              layout="vertical"
                              bordered
                            >
                              <Descriptions.Item
                                label={<strong>Año</strong>}
                                span={1}
                              >
                                {!movieDesc.Year ? "N/A" : movieDesc.Year}
                              </Descriptions.Item>

                              <Descriptions.Item
                                label={<strong>Duración</strong>}
                              >
                                {!movieDesc.Runtime ? "N/A" : movieDesc.Runtime}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Género</strong>}
                              >
                                {!movieDesc.Genre ? "N/A" : movieDesc.Genre}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Dirección</strong>}
                              >
                                {!movieDesc.Director
                                  ? "N/A"
                                  : movieDesc.Director}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Actores</strong>}
                                span={2}
                              >
                                {!movieDesc.Actors ? "N/A" : movieDesc.Actors}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Sinopsis</strong>}
                                span={3}
                              >
                                {!movieDesc.Plot ? "N/A" : movieDesc.Plot}
                              </Descriptions.Item>
                              <Descriptions.Item label={<strong>País</strong>}>
                                {!movieDesc.Country ? "N/A" : movieDesc.Country}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Ratings</strong>}
                                span={5}
                              >
                                {!movieDesc.Ratings
                                  ? "N/A"
                                  : movieDesc.Ratings.map((rate) => {
                                      return `${rate.Source}: ${rate.Value} \n`;
                                    })}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>imbdRating</strong>}
                              >
                                {!movieDesc.imdbRating
                                  ? "N/A"
                                  : movieDesc.imdbRating}
                              </Descriptions.Item>
                              <Descriptions.Item label={<strong>Tipo</strong>}>
                                {!movieDesc.Type ? "N/A" : movieDesc.Type}
                              </Descriptions.Item>
                              <Descriptions.Item label={<strong>DVD</strong>}>
                                {!movieDesc.DVD ? "N/A" : movieDesc.DVD}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Taquilla</strong>}
                              >
                                {!movieDesc.BoxOffice
                                  ? "N/A"
                                  : movieDesc.BoxOffice}
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={<strong>Producción</strong>}
                              >
                                {!movieDesc.Production
                                  ? "N/A"
                                  : movieDesc.Production}
                              </Descriptions.Item>
                            </Descriptions>
                          ) : null}
                        </Col>
                        <Col>
                          <List
                            className="comment-list"
                            header={`${data.length} replies`}
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item) => (
                              <li>
                                <Comment
                                  author={item.author}
                                  avatar={item.avatar}
                                  content={item.content}
                                  datetime={item.datetime}
                                />
                              </li>
                            )}
                          />
                        </Col>
                      </Row>
                    ) : switchModal === "form" ? (
                      <>
                        {comments.length > 0 && (
                          <CommentList comments={comments} />
                        )}
                        <Comment
                          avatar={
                            <Avatar
                              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              alt="Han Solo"
                            />
                          }
                          content={
                            <Editor
                              onChange={handleChange}
                              onSubmit={handleSubmit}
                              submitting={submitting}
                              value={value}
                            />
                          }
                        />
                      </>
                    ) : null}
                  </Modal>
                </Col>
              </>
            );
          })
        : null}
    </Row>
  );
};

export default Content;
