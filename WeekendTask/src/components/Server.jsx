import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio } from "antd";
import axios from "axios";

export default function Server() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    async function getData() {
        axios
            .get("https://northwind.vercel.app/api/categories")
            .then((res) => setData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getData();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    function handleDelete(id) {
        let filteredData = data.filter((data) => data.id !== id);
        setData(filteredData);
        axios
            .delete(`https://northwind.vercel.app/api/categories/${id}`)
            .then((res) => {
                getData();
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
                setData((prevData) => [
                    ...prevData,
                    data.find((data) => data.id === id),
                ]);
            });
    }

    function handleUptade(e) {
        const updatedData = data.map((item) => {
            if (item.id === selectedData.id) {
                return {
                    ...item,
                    name: newName,
                    description: newDescription,
                };
            }
            return item;
        });

        setData(updatedData);
        setIsEditModalOpen(false);
        setSelectedData(null);

        axios
            .put(`https://northwind.vercel.app/api/categories/${selectedData.id}`, {
                name: newName,
                description: newDescription,
            })
            .catch((error) => console.error("Error updating data:", error));
    }

    const openModal = (item) => {
        setSelectedData(item);
        setIsModalOpen(true);
    };

    const openModalEdit = (item) => {
        setSelectedData(item);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setSelectedData(null);
        setIsModalOpen(false);
    };

    const closeModalEdit = () => {
        setIsEditModalOpen(false);
        setSelectedData(null);
    };

    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState("horizontal");
    const onFormLayoutChange = ({ layout }) => {
        setFormLayout(layout);
    };

    return (
        <div>
            <table id="customers">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td className="flex gap-4">
                                <Button
                                    color="primary"
                                    variant="dashed"
                                    onClick={() => openModalEdit(item)}
                                >
                                    Update
                                </Button>
                                <Button
                                    color="danger"
                                    variant="dashed"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    color="default"
                                    variant="dashed"
                                    onClick={() => openModal(item)}
                                >
                                    Detail
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedData && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                            alt="Avatar"
                        />
                        <h2>
                            <strong>ID:</strong>
                            {selectedData.id}
                        </h2>
                        <p>
                            <strong>Name:</strong> {selectedData.name}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedData.description}
                        </p>
                        <Button
                            color="danger"
                            variant="dashed"
                            onClick={closeModal}
                            className="close-modal-btn"
                        >
                            Close Modal
                        </Button>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedData && (
                <div className="modal-overlay" onClick={closeModalEdit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleUptade}
                        >
                            <Form.Item label="Name">
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                        <Button
                            color="danger"
                            variant="dashed"
                            onClick={closeModalEdit}
                            className="close-modal-btn"
                        >
                            Close Modal
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
}
