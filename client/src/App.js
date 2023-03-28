import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Alert, Row, Col, Typography } from 'antd';
const { Option } = Select;
const { Title } = Typography;

function App() {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, contact) => (
        <Space size="middle">
          <a onClick={() => showEditModal(contact)}>Edit</a>
          <a onClick={() => showDeleteModal(contact)}>Delete</a>
        </Space>
      ),
    },
  ];

  const [data, setData] = React.useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [editContact, setEditContact] = useState(null)
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState("")
  const [isShowSuccessMessage, setShowSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isShowErrorMessage, setShowErrorsMessage] = useState(false)
  const newContact = {
    name: "",
    email: "",
    gender: "",
    phone: ""
  }

  React.useEffect(() => {
    fetchContactList()
  }, []);

  const fetchContactList = () => {
    fetch("/api/contacts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data.data)
      });
  }

  const showEditModal = (contact) => {
    setEditModalOpen(true);
    console.log(contact)
    if (contact) {
      setEditContact(contact);
      form.setFieldsValue(contact);
    } else {
      setEditContact(newContact)
      form.setFieldValue(newContact)
    }
  };

  const handleEditOk = () => {
    if (form.getFieldValue('name') === ""
      || form.getFieldValue('email') === "") {
      return;
    }

    setConfirmEditLoading(true);
    editContact.name = form.getFieldValue('name')
    editContact.email = form.getFieldValue('email')
    editContact.phone = form.getFieldValue('phone')
    editContact.gender = form.getFieldValue('gender')

    if (editContact._id) {
      fetch("/api/contacts/" + editContact._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editContact),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setSuccessMessage(data.message);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setConfirmEditLoading(false);
            setEditModalOpen(false);
            setEditContact(null);
          }, 1000);
          fetchContactList()
        }).catch((error) => {
          console.error("Error:", error);
          setErrorMessage(data.message);
          setShowErrorsMessage(true);
          setTimeout(() => {
            setConfirmEditLoading(false);
            setEditModalOpen(false);
            setEditContact(null);
          }, 1000);
          fetchContactList()
        });
    } else {
      fetch("/api/contacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editContact),
      })
        .then((response) => response.json())
        .then((data) => {
          setSuccessMessage(data.message);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setConfirmEditLoading(false);
            setEditModalOpen(false);
            setEditContact(null);
          }, 1000);
          fetchContactList()
        }).catch((error) => {
          setErrorMessage(data.message);
          setShowErrorsMessage(true);
          setTimeout(() => {
            setConfirmEditLoading(false);
            setEditModalOpen(false);
            setEditContact(null);
          }, 1000);
          fetchContactList()
        });
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditContact(null)
  };

  const showDeleteModal = (contact) => {
    setDeleteModalOpen(true);
    setEditContact(contact);
    form.setFieldsValue(contact);
  };

  const handleDeleteOk = () => {
    if (form.getFieldValue('_id') === "") {
      return;
    }

    setConfirmDeleteLoading(true);

    fetch("/api/contacts/" + editContact._id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setSuccessMessage(data.message);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setConfirmDeleteLoading(false);
          setDeleteModalOpen(false);
          setEditContact(null);
        }, 1000);
        fetchContactList()
      }).catch((error) => {
        console.error("Error:", error);
        setErrorMessage(data.message);
        setShowErrorsMessage(true);
        setTimeout(() => {
          setConfirmDeleteLoading(false);
          setDeleteModalOpen(false);
          setEditContact(null);
        }, 1000);
        fetchContactList()
      });
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setEditContact(null)
  };

  return (
    <div className="App">

      <div direction="vertical" style={{ maxWidth: '100%' }}>
        {isShowSuccessMessage && (
          <Alert message={successMessage} type="success" showIcon closable />)}

        {isShowErrorMessage && (
          <Alert message={errorMessage} type="error" showIcon closable />)}
      </div>

      <Row align="bottom" >
        <Col span={4} offset={2}>
          <Title
            level={2}
            style={{ textAlign: "left" }}>
            Contact Table
          </Title>
        </Col>

        <Col span={4} offset={12}>
          <Button onClick={() => showEditModal(null)}
            style={{ float: "right" }}
            type="primary" >
            Add Contact
          </Button>
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col span={20} offset={2}>
          <Table bordered
            rowKey={record => record.id}
            columns={columns}
            dataSource={data} />
        </Col>
      </Row>

      <Modal
        title="Edit Contact"
        open={isEditModalOpen}
        onOk={handleEditOk}
        confirmLoading={confirmEditLoading}
        onCancel={handleEditCancel}
      >
        <Form
          form={form}
          name="control-hooks"
          style={{ maxWidth: 600, marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" >
            <Select
              placeholder="Select a option and change input text above">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Delete Contact"
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        confirmLoading={confirmDeleteLoading}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete the contact?</p>
      </Modal>
    </div>
  );
}

export default App;
