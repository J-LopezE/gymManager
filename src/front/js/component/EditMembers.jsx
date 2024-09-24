import React from "react";
import { FormMembers } from "./FormMembers.jsx";
import "../../styles/editMembers.css";

export const EditMembers = ({ member }) => {
  if (!member) {
    return <p>No se encontró el miembro.</p>;
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#edit-member-${member.id}`}
      >
        <i className="fa-solid fa-pencil"></i>
      </button>

      <div
        className="modal fade"
        id={`edit-member-${member.id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby={`edit-member-${member.id}-label`}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id={`edit-member-${member.id}-label`}
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
              <FormMembers
                btnMember={"Actualizar"}
                member={member}
                id={member.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
