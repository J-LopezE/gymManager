import React from "react";
import "../../styles/editMembers.css";
import { FormMembership } from "./FormMembership.jsx";

export const EditMembership = ({ membership }) => {
  if (!membership) {
    return <p>No se encontró el miembresia.</p>;
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#edit-membership-${membership.id}`}
      >
        <i className="fa-solid fa-pencil"></i>
      </button>

      <div
        className="modal fade"
        id={`edit-membership-${membership.id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby={`edit-membership-${membership.id}-label`}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id={`edit-membership-${membership.id}-label`}
              >
                Editar Miembro
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <FormMembership
                btnMembership={"Actualizar"}
                membership={membership}
                id={membership.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
