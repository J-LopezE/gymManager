import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { FormMembership } from "./FormMembership.jsx";

export const CreateMemberships = ({ member }) => {
  const { actions } = useContext(Context);
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#createMembershipModal"
        onClick={(e) => actions.add_id_member(member.id)}
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      <div
        className="modal fade"
        id="createMembershipModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="createMembershipModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="createMembershipModal">
                Crear Membresía
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <FormMembership btnMembership={"Guardar"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
