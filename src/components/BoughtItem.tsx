import React from "react";
import { ItemInfo } from "../types";
import "../css/item.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

export default function BoughtItem({
  item,
  isOpen,
  onClose,
  lootbox,
}: {
  item: ItemInfo;
  isOpen: boolean;
  onClose: () => void;
  lootbox: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            border: 1,
            borderRadius: 5,
            borderColor: "blue",
            borderWidth: 1,
          }}
          className="modal-content"
        >
          <ModalHeader
            style={{
              textAlign: "center",
              fontSize: "24px",
              color: "green",
              fontWeight: "bold",
              backgroundColor: "white",
            }}
          >
            Congratulations! You Won {item.name}
          </ModalHeader>
          <ModalBody>
            <img
              src={`/images/${lootbox}/${item.image}`}
              alt={item.name}
              style={{ width: "100%", height: "500px" }}
            />
          </ModalBody>
          <ModalFooter style={{ display: "flex", gap: 10 }}>
            <Button
              onClick={onClose}
              style={{
                backgroundColor: "green",
                color: "white",
                borderRadius: "4px",
                padding: "8px 16px",
                outline: "none",
                border: "none",
              }}
            >
              Close
            </Button>
            <Button
              onClick={onClose}
              style={{
                backgroundColor: "green",
                color: "white",
                borderRadius: "4px",
                padding: "8px 16px",
                outline: "none",
                border: "none",
              }}
            >
              Inventory
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
